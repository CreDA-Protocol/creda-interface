import ImageCommon from "@assets/common/ImageCommon";
import { formatBalance } from "@common/Common";
import { Column } from "@components/Column";
import { RowBetween, RowFixed, SpaceWidth, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { TransactionResponse } from "@ethersproject/providers";
import { useBehaviorSubject } from "@hooks/useBehaviorSubject";
import { ChainId } from "@services/chain.service";
import { useTokenContract } from "@services/contracts.service";
import { PortfolioApprovedSpender } from "@services/portfolio/model/portfolio-approved-spender";
import { PortfolioApprovedToken } from "@services/portfolio/model/portfolio-approved-token";
import { useTokenBalance } from "@services/tokens.service";
import { BigNumber } from "ethers";
import { FC, useContext, useState } from "react";
import { NetworkTypeContext } from "src/contexts";
import { useTransactionAdder } from "src/state/transactions/hooks";
import { AddressShowText, BottomRight, CancelButton, LineHNor, SmallIconIcon } from "../StyledComponents";

export const SpenderRow: FC<{
  token: PortfolioApprovedToken;
  spender: PortfolioApprovedSpender;
  chainId: ChainId;
  userTokenBalance: number; // User balance of "token", in readable format
  cancel: (approveCb: () => void) => void;
}> = ({ token, spender, chainId, userTokenBalance, cancel }) => {
  const { chainId: activeChainId } = useContext(NetworkTypeContext);
  const addTransaction = useTransactionAdder();
  const tokenContract = useTokenContract(token.address); // On the active wallet network
  const [allowance] = useBehaviorSubject(spender.allowance$);
  const isMaxExposure = userTokenBalance <= parseInt(allowance);
  const switchToCancel = activeChainId !== chainId;
  const [cancelInProgress, setCancelInProgress] = useState(false);

  function cancelApprove(spenderAddress: string) {
    setCancelInProgress(true);
    tokenContract?.approve(spenderAddress, BigNumber.from(0)).then(async (response: TransactionResponse) => {
      addTransaction(response, {
        summary: "Cancel Approve",
      });
      await response.wait();

      // Remove from local model for display
      token.removeSpender(spender);
    }).catch((err: any) => {
      console.error(err);
      setCancelInProgress(false);
    });
  }

  return (
    <BottomRight>
      <RowBetween style={{ flex: 1 }}>
        <RowFixed>
          <SmallIconIcon src={spender.icon || ImageCommon.Unknown} />
          <Column>
            <ThemeTextEqure fontSize={20}>
              {spender.name ? spender.name : "Unknown project"}
            </ThemeTextEqure>
            <AddressShowText
              style={{ width: 200 }}
              fontColor={"#777E90"}
              fontSize={16}
            >
              {spender.address}
            </AddressShowText>
          </Column>
        </RowFixed>
      </RowBetween>
      <RowFixed style={{ flex: 1, marginLeft: 10 }}>
        <ThemeTextEqure fontSize={20}>
          {isMaxExposure && "All your tokens"}
          {!isMaxExposure && allowance !== null && formatBalance(allowance) + " " + token.symbol.toUpperCase()}
        </ThemeTextEqure>
        <SpaceWidth width={30} widthApp={35} />
        {!cancelInProgress &&
          <CancelButton onClick={() => { cancel(() => cancelApprove(spender.address)); }}>
            {switchToCancel ? "Switch to cancel" : "Cancel"}
          </CancelButton>
        }
      </RowFixed>
    </BottomRight>
  );
}

export const ApproveItem: FC<{
  token: PortfolioApprovedToken;
  chainId: ChainId;
  cancel: (approveCb: () => void) => void;
}> = ({ token, chainId, cancel }) => {
  const { loading, balance } = useTokenBalance(token.address, token.chainId);
  const [spenders] = useBehaviorSubject(token.spenders);
  const [sumExposureUsd] = useBehaviorSubject(token.sumExposureUsd$);

  return (
    <>
      <LineHNor />
      <RowBetween style={{ alignItems: "flex-start" }}>
        <RowBetween style={{ flex: 1, marginRight: 24, marginTop: 10 }}>
          <RowFixed>
            <SmallIconIcon src={token.icon || ImageCommon.Unknown} />
            <Column>
              <TextEqure fontColor={"#777E90"} fontSize={18}>
                {token?.symbol?.toUpperCase()}
              </TextEqure>
              <TextEqure fontColor={"#353945"} fontSize={16}>
                {!loading && <>{formatBalance(balance)} {token?.symbol?.toUpperCase()}</>}
              </TextEqure>
            </Column>
          </RowFixed>
          <ThemeTextEqure fontSize={20}>
            {sumExposureUsd === null && "N/A"}
            {sumExposureUsd !== null && "$" + formatBalance(sumExposureUsd)}
          </ThemeTextEqure>
        </RowBetween>
        <Column style={{ flex: 2 }}>
          {spenders?.length === 0 && <TextEqure fontColor={"#777E90"} fontSize={16} style={{ marginTop: 20, marginLeft: 30 }}>
            No more spender for this token.
          </TextEqure>}
          {spenders?.length > 0 && spenders.map((spender, subIndex) => <SpenderRow token={token} spender={spender} chainId={chainId} cancel={cancel} userTokenBalance={balance} key={subIndex} />)}
        </Column>
      </RowBetween>
    </>
  );
}