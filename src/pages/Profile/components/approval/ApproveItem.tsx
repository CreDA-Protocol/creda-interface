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
import { useBalance } from "@services/tokens.service";
import { BigNumber } from "ethers";
import { FC } from "react";
import { useTransactionAdder } from "src/state/transactions/hooks";
import { AddressShowText, BottomRight, CancelButton, LineHNor, SmallIconIcon } from "../StyledComponents";

export const SpenderRow: FC<{
  token: PortfolioApprovedToken;
  spender: PortfolioApprovedSpender;
  chainId: ChainId;
  userTokenBalance: number; // User balance of "token", in readable format
  cancel: (approveCb: () => void) => void;
}> = ({ token, spender, chainId, userTokenBalance, cancel }) => {
  const addTransaction = useTransactionAdder();
  const tokenContract = useTokenContract(spender.address); // On the active wallet network
  //const allowance = useAllowanceInTokens(token.address, spender.address, chainId);
  const [allowance] = useBehaviorSubject(spender.allowance$);
  const isMaxExposure = userTokenBalance <= parseInt(allowance);

  function cancelApprove(spenderAddress: string) {
    tokenContract?.approve(spenderAddress, BigNumber.from(0)).then(async (response: TransactionResponse) => {
      addTransaction(response, {
        summary: "Cancel Approve",
      });
      await response.wait();
    }).catch((err: any) => {
      console.error(err);
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
          {!isMaxExposure && allowance !== null && formatBalance(allowance) + " " + token.symbol}
        </ThemeTextEqure>
        <SpaceWidth width={30} widthApp={35} />
        <CancelButton
          onClick={() => {
            cancel(() => cancelApprove(spender.address));
          }}
        >
          Cancel
        </CancelButton>
      </RowFixed>
    </BottomRight>
  );
}

export const ApproveItem: FC<{
  token: PortfolioApprovedToken;
  chainId: ChainId;
  cancel: (approveCb: () => void) => void;
}> = ({ token, chainId, cancel }) => {
  const { loading, balance } = useBalance(token.address, token.chainId);
  const [spenders] = useBehaviorSubject(token.spenders);
  const [sumExposureUsd] = useBehaviorSubject(token.sumExposureUsd$);

  return (
    <>
      <LineHNor />
      <RowBetween style={{ alignItems: "flex-start" }}>
        <RowBetween style={{ flex: 1, marginRight: 24, marginTop: 10 }}>
          <RowFixed>
            <SmallIconIcon src={token.icon} />
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
            ${formatBalance(sumExposureUsd)}
          </ThemeTextEqure>
        </RowBetween>
        <Column style={{ flex: 2 }}>
          {spenders.map((spender, subIndex) => <SpenderRow token={token} spender={spender} chainId={chainId} cancel={cancel} userTokenBalance={balance} key={subIndex} />)}
        </Column>
      </RowBetween>
    </>
  );
}