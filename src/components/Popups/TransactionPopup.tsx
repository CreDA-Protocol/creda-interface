import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import {ExternalLink, TYPE } from '../../theme'
import { getScanLink, getScanName } from '../../utils'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import {NetworkTypeContext, WalletAddressContext} from "../../context";
import {ChainId} from "../../common/Common";

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
    const {chainId} = useContext(NetworkTypeContext);
    const {account} = useContext(WalletAddressContext);
    const network = ChainId[chainId];

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={"green"} size={24} /> : <AlertCircle color={"red"} size={24} />}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</TYPE.body>
        {chainId && (
          <ExternalLink href={getScanLink(chainId, hash, 'transaction')}>
            {`View On ${getScanName(chainId)}`}
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
