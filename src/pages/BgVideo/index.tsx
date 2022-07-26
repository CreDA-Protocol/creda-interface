import React, {useEffect, useRef} from "react";
import $ from "jquery"
// @ts-ignore
import vedioSrc from './bgVideo.mp4';
import { isMobile } from "react-device-detect";

require ('./index_style.css')
export default function BgVideo() {

    return(<div className="header" id="demo">
        <video className={isMobile?'audioApp':'audio'}
          autoPlay={true}
          loop={true}
         >
            <source src={vedioSrc} type="video/mp4"/>
            <source src={vedioSrc} type="video/ogg"/>
            <source src={vedioSrc} type="video/webm"/>
        </video>
    </div>)
}
