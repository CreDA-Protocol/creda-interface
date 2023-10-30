import styled from 'styled-components'

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

export const ColumnFixed = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: fit-content
`
export const ColumnNormal = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
  position:relative;
`
export const ColumnJustifyCenter = styled(Column)`
  width: 100%;
  height:100%;
  justify-content: space-between;
`
export const ColumnEnd = styled(Column)`
  width: 100%;
  align-items: flex-end;
`

export const ColumnBetween = styled(Column)`
  width: 100%;
  height:100%;
  justify-content: space-between;
`

export const AutoColumn = styled.div<{
  gap?: 'sm' | 'md' | 'lg' | string
  justify?: 'stretch' | 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'space-between'
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
`
