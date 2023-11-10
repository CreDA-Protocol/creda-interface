import ImageCommon from "@assets/common/ImageCommon";
import { formatBalance } from "@common/Common";
import { Column } from "@components/Column";
import { RowBetween, RowFixed, TextEqure } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { TransactionResponse } from "@ethersproject/providers";
import { useTokenContract } from "@services/contracts.service";
import { BigNumber } from "ethers";
import { useState } from "react";
import { useTheme } from "src/states/application/hooks";
import { useTransactionAdder } from "src/states/transactions/hooks";
import { Arrow, BGDiv, CancelButton, LineH, SmallIconIcon } from "../StyledComponents";

export function ApprovalPhoneItemDiv({ item, cancel }: any) {
  const [showMore, setShowMore] = useState(false);
  const tokenContract = useTokenContract(item.address);
  const addTransaction = useTransactionAdder();
  const themeDark = useTheme();

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
    <Column>
      <RowBetween>
        <RowFixed>
          <SmallIconIcon />
          <Column>
            <TextEqure fontColor={"#777E90"} fontSize={18}>
              {item.symbol}
            </TextEqure>
            <ThemeTextEqure fontSize={16}>
              {formatBalance(item.balance)} {item.symbol}
            </ThemeTextEqure>
          </Column>
        </RowFixed>
        <RowFixed
          onClick={() => {
            setShowMore(!showMore);
          }}
        >
          <ThemeTextEqure fontSize={20}>
            ${formatBalance(item.sumExposureUsd)}
          </ThemeTextEqure>
          <Arrow src={ImageCommon.ArrowDownIcon_white} />
        </RowFixed>
      </RowBetween>
      {showMore && (
        <BGDiv
          style={{
            backgroundColor: themeDark ? "#17181A" : "white",
          }}
        >
          {item.projects.map((subItem: any, subIndex: number) => {
            return (
              <Column style={{ marginTop: 15 }}>
                <RowBetween>
                  <RowFixed>
                    <SmallIconIcon src={subItem.icon} />
                    <ThemeTextEqure fontSize={15}>
                      {subItem.name ? subItem.name : "Unknown project"}
                    </ThemeTextEqure>
                  </RowFixed>
                  <CancelButton
                    onClick={() => {
                      cancel(() => cancelApprove(subItem.address));
                    }}
                  >
                    Cancel
                  </CancelButton>
                </RowBetween>
                <RowBetween>
                  <TextEqure fontColor={"#777E90"} fontSize={10}>
                    Exposure to spender
                  </TextEqure>
                  <ThemeTextEqure fontSize={18}>
                    ${formatBalance(subItem.exposureUsd)}
                  </ThemeTextEqure>
                </RowBetween>
                <RowBetween>
                  <ThemeTextEqure fontSize={18}>All</ThemeTextEqure>
                </RowBetween>
                <RowBetween style={{ overflow: "hidden" }}>
                  <TextEqure fontColor={"#777E90"} fontSize={10}>
                    Project/Contract
                  </TextEqure>
                  <ThemeTextEqure style={{ width: 100 }} fontSize={10}>
                    {subItem.address}
                  </ThemeTextEqure>
                </RowBetween>
              </Column>
            );
          })}
        </BGDiv>
      )}
      <LineH height={15} />
    </Column>
  );
}