import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Texty from 'rc-texty';
import 'rc-texty/assets/index.css';


export default function TextyAnim({title, loading, ...rest }: any) {

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
