import { RowCenter } from "@components/Row";
import WrongNetworkModal from "@components/WrongNetworkModal";
import { chainFromId } from "@services/chain.service";
import { Dropdown } from "antd";
import { useContext, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useStore } from "react-redux";
import styled from "styled-components";
import { formatAccount, globalObj, newTransactionsFirst, } from "../../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../../contexts";
import { useWalkThroughStep } from "../../states/application/hooks";
import { isTransactionRecent, useAllTransactions, } from "../../states/transactions/hooks";
import { base_type } from "../Common";
import Loader from "../Loader";

const StepModalWrap = styled.div<{
  isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "117px" : "124px")};
    left: 50%;
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 132px;
      left:69px;
    }
    @media (min-width: 1700px) {
      top: 136px;
      left: 50%;
    }
  }
`;
const WrongNetworkWrapper = styled.div<{
  isMobile: boolean | null;
}>`
  .walk-through-modal-wrapper {
    top: ${({ isMobile }) => (isMobile ? "97px" : "124px")};
    left: 49%;
    @media (min-width: 768px) and (max-width: 1700px) {
      top: 132px;
      left: 81%;
    }
    @media (min-width: 1700px) {
      top: 137px;
      left: 84%;
    }
  }
`;

/**
 * Content shown from modals, for example ConnectToWalletModal.
 */
export default function ConnectWallet({ history, fromHome, popup }: any) {
  const { t } = useTranslation();
  const location = history?.location?.pathname;
  const { chainId } = useContext(NetworkTypeContext);
  const { account, disconnect } = useContext(WalletAddressContext);
  const network = chainFromId(chainId);
  const allTransactions = useAllTransactions();
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const [modal, setModal] = useState(false);
  const store = useStore();
  const walkThroughStep = useWalkThroughStep();

  const pending = sortedRecentTransactions
    .filter((tx) => !tx.receipt)
    .map((tx) => tx.hash);

  async function connectWallet() {
    globalObj.showConnectModal();
    if (fromHome) {
      history.push({ pathname: "/profile", props: "fromConnectWallet" });
    }
  }

  const items = [{
    label: 'Disconnect',
    key: '1',
    onClick: disconnect,
  }];
  const menuProps = {
    items,
  };

  if (account && !network) {
    return (
      <>
        <WrongNetworkWrapper isMobile={isMobile}>
          <HeaderViewWrong style={{ zIndex: 700 }}>
            <H5>Wrong NetWork</H5>
          </HeaderViewWrong>
          <WrongNetworkModal modal={true} />
        </WrongNetworkWrapper>
      </>
    );
  }
  return (
    <>
      {account ? (
        <Dropdown
          menu={menuProps}
          trigger={["hover", "click"]}
        >
          <HeaderView>
            <H4>{formatAccount(account)}</H4>

            {/*<Arrow src={ImageCommon.ArrowDownIcon_white}/>*/}
            {pending.length > 0 && (
              <Pending>
                {pending?.length}
                <Loader stroke={"#FFFFFF"} />
              </Pending>
            )}
            {/* {location === "/profile" ? (
            <StepModalWrap isMobile={isMobile}>
              <WalkThroughModal
                currentStep={1}
                title="Step 1"
                content="Get your Crypto Credit Score by connecting your wallet."
              />
            </StepModalWrap>
          ) : (
            ""
          )} */}
          </HeaderView>
        </Dropdown>
      ) : (
        <HeaderView onClick={connectWallet}>
          <H4>Connect Wallet</H4>
        </HeaderView>
      )}
    </>
  );
}
export const BaseView = styled.div<base_type>`
    margin-left:${props => props.marginLeft};
    margin-right:${props => props.marginRight};
    margin-top:${props => props.marginTop};
    margin-bottom:${props => props.marginBottom};
    padding-left:${props => props.paddingLeft};
    padding-right:${props => props.paddingRight};
    padding-top:${props => props.paddingTop};
    padding-bottom:${props => props.paddingBottom};
    height:${props => props.height};
    width:${props => props.width};
    text-align:${props => props.textAlign};
    background-color:${props => props.backgroundColor};
    max-width:${props => props.maxWidth};
    min-width:${props => props.minWidth};
    opacity:${props => props.disabled ? 0.6 : 1};
    pointer-events:${props => props.disabled ? "none" : "auto"};
    position:${props => props.position};
    cursor:${props => props.cursor};
    position:relative;
`
export const FlexView = styled(BaseView)`
   display:flex;
   align-items:center;
`
export const HeaderView = styled(RowCenter)`
  height: 32px;
  background-color: #4e55ff;
  border-radius: 80px;
  padding: 0px 20px;
  @media (max-width: 768px) {
    height: 24px;
    border-radius: 40px;
    padding: 0px 15px;
    margin-right: 10px;
    width: auto;
  }
  @media (min-width: 1701px) {
    height: 38px;
  }
  width: 180px;
`;
export const HeaderViewWrong = styled(HeaderView)`
  background-color: rgb(255, 67, 67);
`;
const HeaderNotView = styled(RowCenter)`
  height: 40px;
  border: 1px solid white;
  border-radius: 20px;
  padding: 0px 20px;
  @media (max-width: 768px) {
    height: 20px;
    border-radius: 10px;
    padding: 0px 15px;
  }
  width: 162px;
`;

const Arrow = styled.img`
  width: 6px;
  height: 4px;
  margin-left: 10px;
  margin-top: -5px;
  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
    margin-left: 5px;
  } ;
`;
export const H4 = styled(BaseView)`
  font-size: 16px;
  font-weight: bold;
  color: white;
  @media (max-width: 768px) {
    font-size: 9px;
  }
  cursor: pointer;
`;
export const H5 = styled(H4)`
  font-size: 14px;
`;
const Pending = styled(FlexView)`
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  margin-left: 5px;
`;
