import { DialogContent, DialogOverlay } from '@reach/dialog'
import '@reach/dialog/styles.css'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { animated, useSpring, useTransition } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import styled from 'styled-components'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(AnimatedDialogOverlay)`
  &[data-reach-dialog-overlay] {
    z-index: 999;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:${(opaque)=>`rgba(0,0,0,0.7)`}
  };
`

const AnimatedDialogContent = animated(DialogContent)
// destructure to not pass custom props to Dialog DOM element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogContent = styled(({ minHeight, maxHeight, mobile, isOpen, ...rest }) => (
  <AnimatedDialogContent {...rest} />
)).attrs({
  'aria-label': 'dialog'
})`
  padding:0px;
  border:none;
  border-radius:0px;
  width:100%;
  background-color:transparent;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  prop?:string|null,
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode,
}

export function NormalModal({
  isOpen,
  onDismiss,
  prop,
  minHeight = false,
  maxHeight = 90,
  initialFocusRef,
  children,
}: ModalProps) {
  const fadeTransition = useTransition(isOpen, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 ,backgroundColor:prop==='fromprofile'?'#000000e0':'',backDrop:'static',transition:'.4s'},
    leave: { opacity: 0 },

  })

  const [{ y }, set] = useSpring(() => ({ y: 0, config: { mass: 1, tension: 210, friction: 20 } }))
  const bind = useGesture({
    onDrag: state => {
      set({
        y: state.down ? state.movement[1] : 0
      })
      if (state.movement[1] > 300 || (state.velocity > 3 && state.direction[1] > 0)) {
        onDismiss()
      }
    }
  })
  return (
    <>
      {fadeTransition(
        (props, item) => item && (
            <StyledDialogOverlay style={props} onDismiss={onDismiss} initialFocusRef={initialFocusRef}>
              <StyledDialogContent>
                {!initialFocusRef && isMobile ? <div tabIndex={1} /> : null}
                {children}
              </StyledDialogContent>
            </StyledDialogOverlay>
          )
      )}
    </>
  )
}
