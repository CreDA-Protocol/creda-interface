import { formatBalance } from "@common/Common";
import { Column } from "@components/Column";
import { RowBetween, RowFixed, SpaceWidth, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { TransactionResponse } from "@ethersproject/providers";
import { useTokenContract } from "@services/contracts.service";
import { PortfolioApprovedToken } from "@services/portfolio/model/approvals";
import { useBalance } from "@services/tokens.service";
import { BigNumber } from "ethers";
import { FC } from "react";
import { useTransactionAdder } from "src/state/transactions/hooks";
import { AddressShowText, BottomRight, CancelButton, LineHNor, SmallIconIcon } from "../StyledComponents";

export const ApproveItem: FC<{
  item: PortfolioApprovedToken;
  cancel: (approveCb: () => void) => void;
}> = ({ item, cancel }) => {
  const { loading, balance } = useBalance(item.address, item.chainId);
  const tokenContract = useTokenContract(item.address);
  const addTransaction = useTransactionAdder();

  function cancelApprove(spender: string) {
    tokenContract
      ?.approve(spender, BigNumber.from(0))
      .then(async (response: TransactionResponse) => {
        addTransaction(response, {
          summary: "Cancel Approve",
        });
        await response.wait();
      })
      .catch((err: any) => {
      });
  }

  return (
    <>
      <LineHNor />
      <RowBetween style={{ alignItems: "flex-start" }}>
        <RowBetween style={{ flex: 1, marginRight: 24, marginTop: 10 }}>
          <RowFixed>
            <SmallIconIcon src={item.icon} />
            <Column>
              <TextEqure fontColor={"#777E90"} fontSize={18}>
                {item.symbol}
              </TextEqure>
              <TextEqure fontColor={"#353945"} fontSize={16}>
                {!loading && <>{formatBalance(balance)} {item.symbol}</>}
              </TextEqure>
            </Column>
          </RowFixed>
          <ThemeTextEqure fontSize={20}>
            ${formatBalance(item.sumExposureUsd)}
          </ThemeTextEqure>
        </RowBetween>
        <Column style={{ flex: 2 }}>
          {item.spenders.map((subItem: any, subIndex: number) => {
            return (
              <BottomRight key={subIndex}>
                <RowBetween style={{ flex: 2 }}>
                  <RowFixed>
                    <SmallIconIcon src={subItem.icon} />
                    <Column>
                      <ThemeTextEqure fontSize={20}>
                        {subItem.name ? subItem.name : "Unknown project"}
                      </ThemeTextEqure>
                      <AddressShowText
                        style={{ width: 250 }}
                        fontColor={"#777E90"}
                        fontSize={16}
                      >
                        {subItem.address}
                      </AddressShowText>
                    </Column>
                  </RowFixed>
                  <ThemeTextEqure fontSize={20}>All</ThemeTextEqure>
                </RowBetween>
                <RowFixed style={{ flex: 1, marginLeft: 30 }}>
                  <SpaceWidth width={30} widthApp={35} />
                  <ThemeTextEqure fontSize={20}>
                    ${formatBalance(subItem.exposureUsd)}
                  </ThemeTextEqure>
                  <SpaceWidth width={30} widthApp={35} />
                  <CancelButton
                    onClick={() => {
                      cancel(() => cancelApprove(subItem.address));
                    }}
                  >
                    Cancel
                  </CancelButton>
                </RowFixed>
              </BottomRight>
            );
          })}
        </Column>
      </RowBetween>
    </>
  );
}