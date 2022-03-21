export const shortenAddress = (addr: string) => {
  if (addr.length > 8) {
    return `${addr.substring(0,4)}...${addr.substring(addr.length - 4)}`;
  }
  return addr;
}