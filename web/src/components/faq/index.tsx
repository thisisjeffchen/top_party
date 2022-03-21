import React, {useState} from 'react';
import faqs from './faqs';
import QA from './qa';

const FAQ = () => {
  const [collapsed, toggle] = useState(true);

  return (
    <div className="container py-16 xl:py-24 flex flex-col items-center">
      <div className="text-5xl font-bold text-center">
        FAQ
      </div>
      <div style={{maxWidth: 1000}}>
        {
          faqs.faqs.map(qa => (
            <QA key={qa.q} q={qa.q} a={qa.a}/>
          ))
        }
      </div>
    </div>
  )
}

export default FAQ;