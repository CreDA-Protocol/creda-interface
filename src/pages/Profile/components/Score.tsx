import { ImageCommon } from "@assets/common/ImageCommon";
import { GasInfo, formatBalance, tipError } from "@common/Common";
import { ColumnFixed } from "@components/Column";
import { WhiteButton } from "@components/Common";
import { RowFixed } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { TransactionResponse } from "@ethersproject/providers";
import { ChainIcons } from "@services/chains/chain-configs";
import { chainFromId, chainSupportsCNFT } from '@services/chains/chain.service';
import { useContract } from '@services/contracts.service';
import { useAPICreditScore, useAPIMerkleRootInfo, useContractCreditScore } from "@services/credit.service";
import { Dropdown } from "antd";
import moment from "moment";
import { FC, useContext } from "react";
import { isMobile } from "react-device-detect";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";
import { ContractConfig } from 'src/contract/ContractConfig';
import { LoadingContext, LoadingType } from "src/provider/LoadingProvider";
import { ToastStatus, useAddToast } from "src/states/toast";
import { useTransactionAdder } from "src/states/transactions/hooks";

export const Score: FC<{
  walkThroughStep: number;
}> = ({ walkThroughStep }) => {
  const { account } = useContext(WalletAddressContext);
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);
  const loading = useContext(LoadingContext);
  const scoreInfo = useContractCreditScore()
  const credaInfoFromApi = useAPICreditScore()
  const CredaContract = useContract(ContractConfig.InitialMint[network]?.address, ContractConfig.InitialMint[network]?.abi)
  const DataContract = useContract(ContractConfig.DataContract[network]?.address, ContractConfig.DataContract.abi)
  const addTransaction = useTransactionAdder();
  const addToast = useAddToast();
  const apiMerkleRootInfo = useAPIMerkleRootInfo();

  console.log("Latest merkle root date:", apiMerkleRootInfo?.timestamp?.toLocaleString());

  const items = [{
    label: 'Thank you for joining CreDA. Here is a base credit score as a new user, but your credit score is computed with time. Please come back tomorrow to check your real credit score.',
    key: '1',
  }];
  const menuProps = {
    items,
  };

  async function syncCredit() {
    if (!credaInfoFromApi || !credaInfoFromApi.data || !credaInfoFromApi.data.score) {
      return;
    }

    loading.show(LoadingType.confirm, `Sync`)
    // TODO: we should use getAndUpdateCredit.
    // but for now, we use CredaContract on esc.
    if (DataContract) {
      try {
        DataContract?.updateCredit(account, credaInfoFromApi.data.score, credaInfoFromApi.data.proofs, GasInfo)
          .then(async (response: TransactionResponse) => {
            addTransaction(response, {
              summary: "Sync",
            });
            await response.wait();
            loading.show(LoadingType.success, response.hash)
          })
          .catch((err: any) => {
            addToast(ToastStatus.error, err.data?.message);
            tipError(err);
            loading.show(LoadingType.error, err.reason || err.message)
          });
      } catch (e) {
        loading.show(LoadingType.error, "")
      }
    } else if (CredaContract) {
      CredaContract?.creditUpdate(GasInfo)
        .then(async (response: TransactionResponse) => {
          addTransaction(response, {
            summary: "Sync",
          });
          await response.wait();
          loading.show(LoadingType.success, response.hash)

        })
        .catch((err: any) => {
          addToast(ToastStatus.error, err.data?.message);
          tipError(err);
          loading.show(LoadingType.error, err.reason || err.message)
        });
    }
  }

  return (<div style={{ display: 'flex', flexDirection: 'column' }}>
    {/* Title */}
    <RowFixed style={{ alignSelf: 'center', marginBottom: 6 }}>
      <ThemeTextEqure fontSize={16}>
        Credit Score
      </ThemeTextEqure>
    </RowFixed>

    {/* API / Latest score */}
    {credaInfoFromApi.data &&
      <RowFixed style={{ alignSelf: 'center' }}>
        <ThemeTextEqure fontSize={26} fontWeight={"bold"} style={{ lineHeight: '28px' }}>
          {credaInfoFromApi.data.scoreNotGenerated &&
            <Dropdown
              menu={menuProps}
              trigger={["hover", "click"]}
            >
              <img style={{ width: '25px', marginTop: '-5px' }} src={ImageCommon.Alert} alt="score" />
            </Dropdown>
          }
          {credaInfoFromApi.data.disableScore}
        </ThemeTextEqure>
        <ColumnFixed style={{ marginLeft: "10px" }}>
          <ThemeTextEqure fontSize={14} fontWeight={'400'} style={{ lineHeight: '12px', paddingTop: 4 }}>Latest</ThemeTextEqure>
          {apiMerkleRootInfo?.timestamp &&
            <ThemeTextEqure fontSize={10} fontWeight={'400'}>{apiMerkleRootInfo?.timestamp.format("YYYY.MM.DD")}</ThemeTextEqure>
          }
        </ColumnFixed>
      </RowFixed>
    }

    {/* On chain score */}
    <RowFixed style={{ alignSelf: 'center', marginTop: 4 }}>
      <ThemeTextEqure fontSize={26} fontWeight={"bold"} style={{ lineHeight: '28px' }}>
        {scoreInfo.data <= 0 ? "---" : formatBalance(scoreInfo.data, 0)}
      </ThemeTextEqure>
      <ColumnFixed style={{ marginLeft: "10px" }}>
        <ThemeTextEqure fontSize={14} fontWeight={'400'} style={{ lineHeight: '12px', paddingTop: 4 }}>On Chain</ThemeTextEqure>
        <ThemeTextEqure fontSize={10} fontWeight={'400'}>
          {scoreInfo.timestamp > 0 ? moment.unix(scoreInfo.timestamp).format("YYYY.MM.DD") : "N/A"}
        </ThemeTextEqure>
      </ColumnFixed>
    </RowFixed>

    {/*  SYNC Button */}
    {chainSupportsCNFT(chainId) &&
      <RowFixed style={{ width: "100%", justifyContent: isMobile ? "space-between" : "flex-start", alignSelf: 'center', marginTop: 6 }}
      >
        <WhiteButton style={{ zIndex: walkThroughStep === 2 ? 700 : 0, }} onClick={syncCredit}>
          Sync
        </WhiteButton>
        <img style={{ width: '30px', marginLeft: '5px' }} src={ChainIcons[chainId]} alt="network" />
      </RowFixed>
    }
  </div >)
}