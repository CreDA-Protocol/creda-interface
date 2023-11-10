import { H4 } from "@components/ConnectWallet";
import { CustomGrid, FontPoppins, GradientButton } from "@components/Row";
import SwitchNetworkModal from "@components/SwitchNetworkModal";
import { ThemeText } from "@components/ThemeComponent";
import { chainFromId } from "@services/chains/chain.service";
import { FC, useContext, useState } from "react";
import { isMobile } from "react-device-detect";
import { NetworkTypeContext, WalletAddressContext } from "src/contexts";

/**
 * Shows "Network", the active network, and the user can click to switch network
 */
export const NetworkInfo: FC = () => {
  const { account } = useContext(WalletAddressContext);
  const { chainId } = useContext(NetworkTypeContext);
  const network = chainFromId(chainId);
  const [switchNetworkModal, setSwitchNetworkModal] = useState(false);

  function switchNetwork() {
    setSwitchNetworkModal(true)
  }

  return (
    <CustomGrid
      style={{ marginRight: "unset", textAlign: "right" }}
      templateColumns={"1fr 1fr"}
      mobTemplateColumns={"1fr 1fr"}
      columnGap={15}
      mobColumnGap={15}
    >
      {!isMobile && <FontPoppins>
        <ThemeText fontSize={22} style={{ fontWeight: 800 }}>
          Network
        </ThemeText>
      </FontPoppins>}
      <GradientButton
        className="network_title"
        style={{
          width: !isMobile ? 162 : "fit-content",
          textTransform: "capitalize",
        }}
        onClick={switchNetwork}
      >
        {account && network &&
          <H4>{network.toUpperCase()}</H4>
        }
        {account && !network &&
          <H4> Wrong NetWork</H4>
        }
        {!account &&
          <H4> Not Connected</H4>
        }
      </GradientButton>
      <SwitchNetworkModal
        show={switchNetworkModal}
        onDismiss={() => {
          setSwitchNetworkModal(false);
        }}
      ></SwitchNetworkModal>
    </CustomGrid>
  )
}