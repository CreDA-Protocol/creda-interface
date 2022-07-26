import React, {useContext} from 'react'
import {AlertCircle, CheckCircle} from 'react-feather'
import styled, {ThemeContext} from 'styled-components'
import {useTranslation} from 'react-i18next'
import {TYPE} from '../../theme'
import {AutoColumn} from '../Column'
import {AutoRow} from '../Row'
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import {ChainId} from "../../common/Common";
import {ToastStatus} from "../../state/toast";

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function ToastPopup({
    type,
  content
}: {
    type:ToastStatus,
    content:string
}) {
  //   const {chainId} = useContext(NetworkTypeContext);
  //   const {account} = useContext(WalletAddressContext);
  //   const network = ChainId[chainId];
  //
  // const theme = useContext(ThemeContext)
  // const { t } = useTranslation()

  return (
    <RowNoFlex style={{zIndex : 1050}}>
      <div style={{ paddingRight: 16 }}>
        {type===ToastStatus.success ? <CheckCircle color={"green"} size={24} /> : <AlertCircle color={"red"} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{content}</TYPE.body>
      </AutoColumn>
    </RowNoFlex>
  )
}
