import React, {useEffect, useRef, useState} from "react";
import Konva from 'konva';
import { useSpring,animated } from "react-spring";
import styled from "styled-components";
import { Stage, Layer, Rect,Circle,Line,Image } from "react-konva";
import ImageCommon from "../../assets/common/ImageCommon";
import useImage from "use-image";

export default function Test() {
    const [metamask] = useImage(ImageCommon.metamask)
    const line1 = useRef<any>(null)
    const line2= useRef<any>(null)
    const line3= useRef<any>(null)
    const line4= useRef<any>(null)
    const line5= useRef<any>(null)
    const line6= useRef<any>(null)
    useEffect(()=>{
        line1Animation()
    },[])
    function line1Animation() {
        line1?.current.to({
            width:250,
            duration:2,
            onFinish:line2Animation
        })
    }
    function line2Animation() {
        line2?.current.to({
            width:250,
            duration:2,
            onFinish:line3Animation
        })
    }
    function line3Animation() {
        line3?.current.to({
            width:250,
            duration:2,
            onFinish:line4Animation
        })
    }
    function line4Animation() {
        line4?.current.to({
            width:250,
            duration:2,
            onFinish:line5Animation
        })
    }
    function line5Animation() {
        line5?.current.to({
            width:250,
            duration:2,
            onFinish:line6Animation
        })
    }
    function line6Animation() {
        line6?.current.to({
            width:250,
            duration:2,
            onFinish:line1Animation
        })
    }
    return(
        <Contianer>
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <Image
                        image={metamask}
                    ></Image>
                    <Circle
                        x={150}
                        y={250}
                        radius={50}
                        fill={"black"}
                    ></Circle>
                    <Circle
                        x={50}
                        y={500}
                        radius={50}
                        fill={"red"}
                    ></Circle>
                    <Circle
                        x={300}
                        y={500}
                        radius={100}
                        fill={"black"}
                    ></Circle>
                    <Circle
                        x={550}
                        y={500}
                        radius={50}
                        fill={"red"}
                    ></Circle>
                    <Circle
                        x={400}
                        y={250}
                        radius={50}
                        fill={"pink"}
                    ></Circle>
                    <Rect
                        x={150}
                        y={250}
                        width={0}
                        stroke={"red"}
                        strokeWidth={10}
                        rotation={115}
                        ref={line1}
                    ></Rect>
                    <Rect
                        x={100}
                        y={500}
                        width={0}
                        stroke={"black"}
                        strokeWidth={10}
                        ref={line2}
                    ></Rect>
                    <Rect
                        x={300}
                        y={500}
                        width={0}
                        stroke={"red"}
                        strokeWidth={10}
                        ref={line3}
                    ></Rect>
                    <Rect
                        x={550}
                        y={500}
                        width={0}
                        stroke={"pink"}
                        strokeWidth={10}
                        rotation={240}
                        ref={line4}
                    ></Rect>
                    <Rect
                        x={400}
                        y={250}
                        width={0}
                        stroke={"black"}
                        strokeWidth={10}
                        rotation={115}
                        ref={line5}
                    ></Rect>
                    <Rect
                        x={300}
                        y={500}
                        width={0}
                        stroke={"black"}
                        strokeWidth={10}
                        rotation={240}
                        ref={line6}
                    ></Rect>
                </Layer>
            </Stage>
        </Contianer>
    )
}
const Contianer = styled.div`
    display:flex;
    width:500px;
    height:800px;
    // justify-content:space-between;
    // align-items:flex-end;
`
