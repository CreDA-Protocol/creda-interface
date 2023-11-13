import { MainFullBody, AppBody } from "@pages/AppBody";

function Governance(props: any) {
  return (
    <MainFullBody history={props.history}>
      <AppBody history={props.history}>
        <div style={{ color: 'white', width: '100%', backgroundColor: 'blue' }}>Governance</div>

      </AppBody>
    </MainFullBody>
  )
}
export default Governance;
