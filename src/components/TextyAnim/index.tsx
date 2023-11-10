import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';
import React, { useEffect, useState } from 'react';

export function TextyAnim({title, loading, ...rest }: any) {

  const [show,setShow] = useState(false)
  useEffect(()=>{
    setInterval(() => {
      setShow((pre)=>!pre)
    }, 1000);
  },[])

 return <div>
    <Texty>{show && title}</Texty>
  </div>
}
