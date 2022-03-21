import React from 'react';

const QA = ({q, a}: {q: string, a: string}) => {
  return (
    <div className="mt-8 sm:mt-16">
      <div className="font-bold text-2xl">
        {q}
      </div>
      <div className="mt-2 text-lg">
        {a}
      </div>
    </div>
  )
}

export default QA;