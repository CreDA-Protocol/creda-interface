import { MainFullBody, AppBody } from "@pages/AppBody";

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
