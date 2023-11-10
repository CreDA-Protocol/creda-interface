import { ChainId, chainFromId } from "@services/chain.service";
import { switchNetwork } from "@services/network.service";
import { PortfolioDataset } from "@services/portfolio/model/dataset";
import { PortfolioApprovedToken } from "@services/portfolio/model/portfolio-approved-token";
import { FC, useContext } from "react";
import { NetworkTypeContext } from "src/contexts";
import { ApprovalPhoneItemDiv } from "./ApprovalPhoneItemDiv";

export const ApprovalPhoneDiv: FC<{
  data: PortfolioDataset<PortfolioApprovedToken[]>;
  chainId: ChainId;
}> = ({ data, chainId }) => {
  const { chainId: activeChainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);

  function cancel(cancelApprove: () => void) {
    if (chainId === activeChainId) {
      cancelApprove && cancelApprove();
    } else {
      switchNetwork(chainId);
    }
  }

  return (
    <>
      {!data.loading &&
        data.data.map((item, index) => {
          return <ApprovalPhoneItemDiv item={item} cancel={cancel} key={index} />;
        })}
    </>
  );
}