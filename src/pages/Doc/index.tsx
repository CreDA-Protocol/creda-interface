// import styled from 'styled-components'
// import ImageCommon from '@assets/common/ImageCommon'
import AppBody, { MainFullBody } from '@pages/components/AppBody';

function Doc(props: any) {
  return (
    <MainFullBody history={props.history}>
      <AppBody history={props.history}>
        <div style={{ color: 'white', width: '100%', backgroundColor: 'blue' }}>Doc</div>
      </AppBody>
    </MainFullBody>
  )
}

export default Doc;
