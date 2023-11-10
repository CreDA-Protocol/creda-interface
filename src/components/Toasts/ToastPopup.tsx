import { AlertCircle, CheckCircle } from 'react-feather'
import styled from 'styled-components'
import { ToastStatus } from "../../states/toast"
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export function ToastPopup({
  type,
  content
}: {
  type: ToastStatus,
  content: string
}) {
  //   const {chainId} = useContext(NetworkTypeContext);
  //   const {account} = useContext(WalletAddressContext);
  //   const network = chainFromId(chainId);
  //
  // const theme = useContext(ThemeContext)
  // const { t } = useTranslation()

  return (
    <RowNoFlex style={{ zIndex: 1050 }}>
      <div style={{ paddingRight: 16 }}>
        {type === ToastStatus.success ? <CheckCircle color={"green"} size={24} /> : <AlertCircle color={"red"} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{content}</TYPE.body>
      </AutoColumn>
    </RowNoFlex>
  )
}
