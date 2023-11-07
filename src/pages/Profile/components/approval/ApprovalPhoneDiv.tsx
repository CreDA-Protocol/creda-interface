import { ChainIdConfig } from "@common/Common";
import { ChainName, chainFromId } from "@services/chain.service";
import { switchNetwork } from "@services/network.service";
import { PortfolioApprovedToken } from "@services/portfolio/model/approvals";
import { PortfolioDataset } from "@services/portfolio/model/dataset";
import { FC, useContext } from "react";
import { NetworkTypeContext } from "src/contexts";
import { ApprovalPhoneItemDiv } from "./ApprovalPhoneItemDiv";

export const ApprovalPhoneDiv: FC<{
  data: PortfolioDataset<PortfolioApprovedToken[]>;
  netType: ChainName;
}> = ({ data, netType }) => {
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);

  function cancel(cancelApprove: () => void) {
    if (network === netType) {
      cancelApprove && cancelApprove();
    } else {
      switchNetwork(ChainIdConfig[netType]);
    }
  }

  return (
    <>
      {!data.loading &&
        data.data.map((item, index) => {
          return <ApprovalPhoneItemDiv item={item} cancel={cancel} />;
        })}
    </>
  );
}