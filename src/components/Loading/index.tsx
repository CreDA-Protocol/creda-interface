import { ImageCommon } from "@assets/common/ImageCommon";
import styled from "styled-components";

export function Loading() {
  return (
    <Container>
      <Logo src={ImageCommon.credaLogoForDark}></Logo>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #000c17;
`
const Logo = styled.img`
  width: 100px;
`
