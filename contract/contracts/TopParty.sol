// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import {IERC721Metadata} from "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

import "./interfaces/IFracTokenVault.sol";
import "./interfaces/IFracVaultFactory.sol";
import "./interfaces/ITokenVault.sol";

/**
 * @title TopParty contract
 * @author twitter.com/devloper_eth
 * @notice Nouns party is an effort aimed at making community-driven nouns bidding easier, more interactive, and more likely to win than today's strategies.
 */
// solhint-disable max-states-count
contract TopParty is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    struct Deposit {
        address owner;
        uint256 amount;
        bool tokenClaimed;
    }

    struct ContractState {
        address creator;
        string symbol;
        bool paused;
    }

    struct BuyAttempt {
        uint256 tokenId;
        bool success;
        uint256 totalCost;
        uint32 poolStartAt;
        uint32 poolEndAt;
        address vaultAddress;
    }

    struct ClaimableItem {
        address contractAddress;
        uint256 attemptIdx;
        uint256 depositIdx;
    }

    event LogWithdraw(address sender, uint256 amount);

    event LogFractionalize(uint256 indexed nounId, uint256 supply, uint256 fee);

    event LogClaim(
        address sender,
        uint256 nounId,
        address fracTokenVaultAddress,
        uint256 tokens
    );

    event LogSettleWon(uint256 nounId);

    event LogSettleLost(uint256 nounId);

    event LogDeposit(address sender, uint256 amount);

    // tokens are minted at a rate of 1 ETH : 1000 tokens
    uint16 internal constant TOKEN_SCALE = 1000;
    uint256 private constant ETH1_1000 = 1_000_000_000_000_000; // 0.001 eth
    uint256 private constant ETH1_10 = 100_000_000_000_000_000; // 0.1 eth

    uint256 public minPurchaseValue;
    address public topPartyWallet;

    address public fracVaultFactoryAddress;
    IFracVaultFactory public fracVaultFactory;

    mapping(address => Deposit[]) public depositPools;
    mapping(address => uint256) public currentPoolAmount;
    mapping(address => uint32) public currentPoolStartAt;

    mapping(address => BuyAttempt[]) public buyAttempts;

    address[] public contractList;
    mapping(address => ContractState) public contractStates;

    modifier contractExist(address _contractAddress) {
        require(
            contractStates[_contractAddress].creator != address(0),
            "NFTContract must exist"
        );
        _;
    }

    modifier contractNotPaused(address _contractAddress) {
        require(
            contractStates[_contractAddress].creator != address(0),
            "NFTContract must exist"
        );
        require(
            !contractStates[_contractAddress].paused,
            "NFTContract not paused"
        );
        _;
    }

    modifier ownerOrCreator(address _contractAddress) {
        require(
            contractStates[_contractAddress].creator == msg.sender ||
                owner() == msg.sender,
            "Must be owner or creator"
        );
        _;
    }

    function initialize(
        uint256 _minPurchaseValue,
        address _topPartyWallet,
        address _fracVaultFactoryAddress
    ) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        require(
            _fracVaultFactoryAddress != address(0),
            "zero fracVaultFactoryAddress"
        );

        minPurchaseValue = _minPurchaseValue;
        topPartyWallet = _topPartyWallet;
        fracVaultFactoryAddress = _fracVaultFactoryAddress;
        fracVaultFactory = IFracVaultFactory(_fracVaultFactoryAddress);
    }

    // ======== External: Buy =========

    /**
     * @notice Buy the token by calling targetContract with calldata supplying value
     * @dev Emits a Bought event upon success; reverts otherwise. callable by anyone
     */
    function buy(
        address _contractAddress,
        uint256 _tokenId,
        uint256 _value,
        address _sellerContract,
        bytes calldata _calldata
    )
        external
        nonReentrant
        contractExist(_contractAddress)
        ownerOrCreator(_contractAddress)
    {
        // check that value is above min to cover gas
        require(_value >= minPurchaseValue, "Must more than minPurchaseValue");
        // check that value is not more than
        // the maximum amount the party can spend while paying ETH fee
        uint256 _fee = calcFee(_value);
        uint256 _totalCost = _value + _fee;

        require(
            _totalCost <= currentPoolAmount[_contractAddress],
            "Insuffucient funds price + fee"
        );
        // require that the NFT is NOT owned by the Party
        require(
            _getOwner(_contractAddress, _tokenId) != address(this),
            "Own token before call"
        );
        // execute the calldata on the target contract
        (bool _success, bytes memory _returnData) = address(_sellerContract)
            .call{value: _value}(_calldata);
        // require that the external call succeeded
        require(_success, string(_returnData));
        // require that the NFT is owned by the Party
        require(
            _getOwner(_contractAddress, _tokenId) == address(this),
            "Failed to buy token"
        );

        address _vaultAddress = _fractionalizeNFT(
            _contractAddress,
            _tokenId,
            _totalCost
        );
        _settleAfterPurchase(
            _contractAddress,
            _tokenId,
            _totalCost,
            _vaultAddress
        );
        // send ETH fees to TopPartyWallet,
        _transferETH(topPartyWallet, _fee);
    }

    /// @notice Puts ETH into our desposit pool.
    function deposit(address _contractAddress)
        external
        payable
        nonReentrant
        contractNotPaused(_contractAddress)
    {
        // Verify deposit amount to ensure fractionalizing will produce whole numbers.
        require(msg.value % ETH1_1000 == 0, "Must be in 0.001 ETH increments");

        // v0 asks for a 0.1 eth minimum deposit.
        // v1 will ask for 0.001 eth as minimum deposit.
        require(msg.value >= ETH1_10, "Minimum deposit is 0.1 ETH");

        Deposit memory d = Deposit({
            owner: msg.sender,
            amount: msg.value,
            tokenClaimed: false
        });

        depositPools[_contractAddress].push(d);
        currentPoolAmount[_contractAddress] += msg.value;
        // emit LogDeposit(msg.sender, msg.value);
    }

    /// @notice claim your specific reward
    function claimable()
        external
        view
        returns (ClaimableItem[10] memory items)
    {
        // capped at 10 items
        uint16 _itemIdx = 0;
        for (
            uint256 _contractIdx = 0;
            _contractIdx < contractList.length;
            _contractIdx++
        ) {
            address _contractAddress = contractList[_contractIdx];
            for (
                uint256 _attemptIdx = 0;
                _attemptIdx < buyAttempts[_contractAddress].length;
                _attemptIdx++
            ) {
                BuyAttempt memory _attempt = buyAttempts[_contractAddress][
                    _attemptIdx
                ];
                for (
                    uint256 _depositIdx = _attempt.poolStartAt;
                    _depositIdx <= _attempt.poolEndAt;
                    _depositIdx++
                ) {
                    Deposit memory _deposit = depositPools[_contractAddress][
                        _depositIdx
                    ];
                    if (
                        _deposit.owner == msg.sender && !_deposit.tokenClaimed
                    ) {
                        items[_itemIdx] = ClaimableItem({
                            contractAddress: _contractAddress,
                            attemptIdx: _attemptIdx,
                            depositIdx: _depositIdx
                        });
                        _itemIdx++;
                        if (_itemIdx >= 10) {
                            return items;
                        }
                    }
                }
            }
        }
    }

    /// @notice claim your specific token
    function claimAll(ClaimableItem[] memory items) external nonReentrant {
        for (uint256 i = 0; i < items.length; i++) {
            _claimOne(
                items[i].contractAddress,
                items[i].attemptIdx,
                items[i].depositIdx
            );
        }
    }

    /// @notice claim your specific token
    function claim(
        address _contractAddress,
        uint256 _attemptIdx,
        uint256 _depositIdx
    ) external nonReentrant contractExist(_contractAddress) {
        _claimOne(_contractAddress, _attemptIdx, _depositIdx);
    }

    /// @notice Withdraw deposits that haven't been used.
    function withdraw(address _contractAddress)
        external
        nonReentrant
        contractExist(_contractAddress)
    {
        uint256 withdrawable = 0;
        for (
            uint32 i = currentPoolStartAt[_contractAddress];
            i < depositPools[_contractAddress].length;
            i++
        ) {
            Deposit memory d = depositPools[_contractAddress][i];
            if (d.owner == msg.sender) {
                withdrawable += d.amount;
                delete depositPools[_contractAddress][i];
            }
        }
        require(withdrawable > 0, "Must have non-used deposit");
        currentPoolAmount[_contractAddress] -= withdrawable;
        //emit LogWithdraw(msg.sender, amount);
        _transferETH(msg.sender, withdrawable);
    }

    function withdrawableAmount(address _contractAddress)
        external
        view
        contractExist(_contractAddress)
        returns (uint256)
    {
        uint256 withdrawable = 0;
        for (
            uint32 i = currentPoolStartAt[_contractAddress];
            i < depositPools[_contractAddress].length;
            i++
        ) {
            Deposit memory d = depositPools[_contractAddress][i];
            if (d.owner == msg.sender) {
                withdrawable += d.amount;
            }
        }
        return withdrawable;
    }

    function addContract(address _contractAddress, string calldata _symbol)
        external
        nonReentrant
        onlyOwner
    {
        require(
            contractStates[_contractAddress].creator == address(0),
            "NFTContract must not exist"
        );
        contractStates[_contractAddress] = ContractState({
            creator: msg.sender,
            symbol: _symbol,
            paused: false
        });
        contractList.push(_contractAddress);
    }

    function setSymbol(address _contractAddress, string calldata _symbol)
        external
        nonReentrant
        contractExist(_contractAddress)
        ownerOrCreator(_contractAddress)
    {
        contractStates[_contractAddress].symbol = _symbol;
        // Emit pause event
    }

    function pause(address _contractAddress)
        external
        nonReentrant
        contractExist(_contractAddress)
        ownerOrCreator(_contractAddress)
    {
        require(!contractStates[_contractAddress].paused, "Already paused");
        contractStates[_contractAddress].paused = true;
        // Emit pause event
    }

    function unpause(address _contractAddress)
        external
        nonReentrant
        contractExist(_contractAddress)
        ownerOrCreator(_contractAddress)
    {
        require(contractStates[_contractAddress].paused, "Must in pause");
        contractStates[_contractAddress].paused = false;
        // Emit pause event
    }

    function calcFee(uint256 _value) public pure returns (uint256) {
        // 2.5%
        return (_value * 25) / 1000;
    }

    function setMinPurchaseValue(uint256 _value)
        external
        nonReentrant
        onlyOwner
    {
        minPurchaseValue = _value;
    }

    function setTopPartyWallet(address _addr) external nonReentrant onlyOwner {
        topPartyWallet = _addr;
    }

    function _settleAfterPurchase(
        address _contractAddress,
        uint256 _tokenId,
        uint256 _totalCost,
        address _vaultAddress
    ) internal nonReentrant {
        currentPoolAmount[_contractAddress] -= _totalCost;
        uint32 _indexWithoutGap = currentPoolStartAt[_contractAddress];
        uint32 _readingIndex = _indexWithoutGap;
        uint32 _previousStartAt = _indexWithoutGap;
        uint256 _accAmount = 0;
        Deposit memory _currentDeposit;
        for (
            ;
            _readingIndex < depositPools[_contractAddress].length;
            _readingIndex++
        ) {
            _currentDeposit = depositPools[_contractAddress][_readingIndex];
            if (_currentDeposit.owner != address(0)) {
                // is one buyer
                _accAmount += _currentDeposit.amount;
                if (_readingIndex != _indexWithoutGap) {
                    depositPools[_contractAddress][
                        _indexWithoutGap
                    ] = _currentDeposit;
                }
                _indexWithoutGap++;
                if (_accAmount >= _totalCost) {
                    break;
                }
            }
        }
        uint32 _currentPoolEndAt = _indexWithoutGap - 1;
        // new start at
        currentPoolStartAt[_contractAddress] = _indexWithoutGap;
        uint256 _remaining = _accAmount - _totalCost;
        if (_readingIndex != _indexWithoutGap) {
            if (_remaining > 0) {
                _indexWithoutGap++;
                depositPools[_contractAddress][_indexWithoutGap] = Deposit({
                    owner: _currentDeposit.owner,
                    amount: _remaining,
                    tokenClaimed: false
                });
            }
            // no need to move if it's the only gap
            if (_readingIndex != _indexWithoutGap) {
                for (
                    ;
                    _readingIndex < depositPools[_contractAddress].length;
                    _readingIndex++
                ) {
                    _currentDeposit = depositPools[_contractAddress][
                        _readingIndex
                    ];
                    if (_currentDeposit.owner != address(0)) {
                        depositPools[_contractAddress][
                            _indexWithoutGap
                        ] = _currentDeposit;
                        _indexWithoutGap++;
                    }
                }
                for (; _indexWithoutGap < _readingIndex - 1; _indexWithoutGap) {
                    depositPools[_contractAddress].pop();
                }
            }
        } else {
            if (_remaining > 0) {
                depositPools[_contractAddress].push(
                    Deposit({
                        owner: _currentDeposit.owner,
                        amount: _remaining,
                        tokenClaimed: false
                    })
                );
            }
        }
        buyAttempts[_contractAddress].push(
            BuyAttempt({
                tokenId: _tokenId,
                success: true,
                totalCost: _totalCost,
                poolStartAt: _previousStartAt,
                poolEndAt: _currentPoolEndAt,
                vaultAddress: _vaultAddress
            })
        );
        // emit
    }

    /**
     * @notice Upon winning the token, transfer the NFT
     * to fractional.art vault & mint fractional ERC-20 tokens
     */
    function _fractionalizeNFT(
        address _contractAddress,
        uint256 _tokenId,
        uint256 _totalCost
    ) internal returns (address) {
        // approve fractionalized NFT Factory to withdraw NFT
        IERC721Metadata _nftContract = IERC721Metadata(_contractAddress);
        _nftContract.approve(address(fracVaultFactory), _tokenId);
        // deploy fractionalized NFT vault

        string memory symbol = string(
            abi.encodePacked(
                contractStates[_contractAddress].symbol,
                StringsUpgradeable.toString(_tokenId)
            )
        );

        uint256 _totalToken = _totalCost * 1025 / 1000;
        uint256 _vaultNumber = fracVaultFactory.mint(
            symbol,
            symbol,
            _contractAddress,
            _tokenId,
            _totalToken * TOKEN_SCALE,
            _totalToken * 5,
            0
        );

        // store token vault address to storage
        address _tokenVaultAddress = fracVaultFactory.vaults(_vaultNumber);
        // transfer curator to null address (burn the curator role)
        ITokenVault(_tokenVaultAddress).updateCurator(address(0));

        uint256 _topPartyToken = _totalToken - _totalCost;
        _transeferToken(_tokenVaultAddress, topPartyWallet, _topPartyToken);
        return _tokenVaultAddress;
    }

    /**
     * @notice Query the NFT contract to get the token owner
     * @dev nftContract must implement the ERC-721 token standard exactly:
     * function ownerOf(uint256 _tokenId) external view returns (address);
     * See https://eips.ethereum.org/EIPS/eip-721
     * @dev Returns address(0) if NFT token or NFT contract
     * no longer exists (token burned or contract self-destructed)
     * @return _owner the owner of the NFT
     */
    function _getOwner(address _contractAddress, uint256 _tokenId)
        internal
        view
        returns (address _owner)
    {
        (bool _success, bytes memory _returnData) = _contractAddress.staticcall(
            abi.encodeWithSignature("ownerOf(uint256)", _tokenId)
        );
        if (_success && _returnData.length > 0) {
            _owner = abi.decode(_returnData, (address));
        }
    }

    /// @notice claim your specific token
    function _claimOne(
        address _contractAddress,
        uint256 _attemptIdx,
        uint256 _depositIdx
    ) internal contractExist(_contractAddress) {
        BuyAttempt memory _attempt = buyAttempts[_contractAddress][_attemptIdx];
        require(_attempt.success, "Must be a success purchase");
        require(
            _depositIdx >= _attempt.poolStartAt &&
                _depositIdx <= _attempt.poolEndAt,
            "Must claim inside attempt pool"
        );
        Deposit memory _deposit = depositPools[_contractAddress][_depositIdx];
        require(_deposit.owner == msg.sender, "Sender must match deposit");
        require(!_deposit.tokenClaimed, "Token mustn't be claimed before");

        _transeferToken(_attempt.vaultAddress, _deposit.owner, _deposit.amount);
        depositPools[_contractAddress][_depositIdx].tokenClaimed = true;
    }

    function _transeferToken(address _vaultAddress, address _to, uint256 _value) private {
        ITokenVault _tokenVault = ITokenVault(_vaultAddress);
        // guard against rounding errors;
        // if token amount to send is greater than contract balance,
        // send full contract balance
        uint256 _partyBalance = _tokenVault.balanceOf(address(this));
        uint256 _tokenAmount = _value * TOKEN_SCALE;
        if (_tokenAmount > _partyBalance) {
            _tokenAmount = _partyBalance;
        }
        _tokenVault.transfer(_to, _tokenAmount);
    }

    // @dev Authorize OpenZepplin's upgrade function, guarded by onlyOwner.
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {} // solhint-disable-line no-empty-blocks

    /// @dev Transfer ETH and revert if unsuccessful. Only forward 30,000 gas to the callee.
    function _transferETH(address _to, uint256 _value) private {
        (bool success, ) = _to.call{value: _value, gas: 30_000}(new bytes(0)); // solhint-disable-line avoid-low-level-calls
        require(success, "Transfer failed");
    }

    /// @dev Allow contract to receive Eth. For example when we are outbid.
    receive() external payable {} // solhint-disable-line no-empty-blocks
}
