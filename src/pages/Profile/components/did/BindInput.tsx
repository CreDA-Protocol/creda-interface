import ImageCommon from "@assets/common/ImageCommon";
import { chainFromId, tipError } from "@common/Common";
import { FlexView } from "@components/Common";
import { GradientButton } from "@components/Row";
import { TransactionResponse } from "@ethersproject/providers";
import { useContract } from "@hooks/useContract";
import { useContext, useState } from "react";
import { NetworkTypeContext } from "src/contexts";
import ContractConfig from "src/contract/ContractConfig";
import { useTheme } from "src/state/application/hooks";
import { ToastStatus, useAddToast } from "src/state/toast";
import { useTransactionAdder } from "src/state/transactions/hooks";
import styled from "styled-components";

//bind input
export function BindInput() {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState("");
  const themeDark = useTheme();
  const addTransaction = useTransactionAdder();
  const addToast = useAddToast();
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);
  const APIContract = useContract(ContractConfig.APIConsumer[network]?.address, ContractConfig.APIConsumer.abi);

  function bindDID(did: string) {
    // console.log(APIContract);
    APIContract?.bindAddress(did)
      .then(async (response: TransactionResponse) => {
        addTransaction(response, {
          summary: "Bind DID",
        });
        await response.wait();
      })
      .catch((err: any) => {
        addToast(ToastStatus.error, err.data?.message);
        tipError(err);
      });
  }

  if (!edit) {
    return (
      <EditIcon
        src={ImageCommon.icon_edit}
        onClick={() => setEdit(true)}
      ></EditIcon>
    );
  }

  return (
    <FlexView>
      <BInput
        themeDark={themeDark}
        placeholder={"Input the DID"}
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></BInput>
      <GradientButton
        onClick={() => {
          bindDID && bindDID(input);
        }}
      >
        Confirm
      </GradientButton>
    </FlexView>
  );
}

const EditIcon = styled.img`
  width: 22px;
  height: auto;
  cursor: pointer;
`;

const BInput = styled.input<{
  themeDark?: boolean | null;
}>`
  font-family: "Poppins Regular", sans-serif;
  outline: none;
  background: none;
  outline: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  color: ${({ themeDark }) => `${themeDark ? "#FFFFFF" : "#17181A"}`};
  line-height: 70px;
  @media (max-width: 768px) {
    width: 100%;
    font-size: 12px;
  };
`;
