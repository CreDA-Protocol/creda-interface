import { chainFromId } from '@services/chains/chain.service';
import { useContext } from 'react';
import { AlertCircle, CheckCircle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import styled, { ThemeContext } from 'styled-components';
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import { ExternalLink, TYPE } from '../../theme';
import { getScanLink, getScanName } from '../../utils';
import { AutoColumn } from '../Column';
import { AutoRow } from '../Row';

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useContext(NetworkTypeContext);
  const { account } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);

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
