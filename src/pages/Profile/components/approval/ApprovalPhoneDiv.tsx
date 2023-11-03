import { ChainIdConfig, switchNetwork } from "@common/Common";
import { chainFromId } from "@services/chain.service";
import { useContext } from "react";
import { NetworkTypeContext } from "src/contexts";
import { ApprovalPhoneItemDiv } from "./ApprovalPhoneItemDiv";

export function ApprovalPhoneDiv({ data, netType }: any) {
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);

  function cancel(cancelApprove: any) {
    if (network === netType) {
      cancelApprove && cancelApprove();
    } else {
      switchNetwork(ChainIdConfig[netType]);
    }
  }

  return (
    <>
      {!data.loading &&
        data.data.authorizations.map((item: any, index: number) => {
          return <ApprovalPhoneItemDiv item={item} cancel={cancel} />;
        })}
    </>
  );
}