import { Suspense, useEffect, useState } from "react";
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';




import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { animated, useSpring } from 'react-spring';
import ImageCommon from "../assets/common/ImageCommon";
import {
  ChainId,
  createWalletConnectWeb3Provider,
  ethereum,
  globalObj,
  walletInfo
} from "../common/Common";
import { ButtonClick } from "../components/Button";
import Column, { ColumnNormal } from "../components/Column";
import { ColumnBetween } from "../components/Column/index";
import Loading from "../components/Loading";
import Popups from "../components/Popups";
import {
  CustomGrid,
  RowBetween,
  RowCenter,
  RowFixed,
  SpaceHeight,
  SpaceWidth,
  Text,
  WrapMaxWidth,
} from "../components/Row";
import { ThemeText } from "../components/ThemeComponent";
import Toasts from "../components/Toasts";
import WalletConnectModal from "../components/WalletConnectModal";
import { NetworkTypeContext, WalletAddressContext } from "../context";
import "../i18n";
import LoadingProvider from "../provider/LoadingProvider";
import store from "../state";
import { useTheme } from "../state/application/hooks";
import ApplicationUpdater from "../state/application/updater";
import TransactionUpdater from "../state/transactions/updater";
import ThemeProvider from "../theme";
import AboutUs from "./AboutUs";
import { RedirectPathToHomeOnly } from "./Home/redirects";
import Press from "./Press";
import News from "./Press/News";
import Test from "./test";

import "@assets/css/custom.css";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

`;
const BodyWrapper = styled.div`
  width: 100%;
  //display: flex;
  //flex-direction: column;

  //padding-top: 0px;
  //flex: 1;
  //z-index: 1;
  //align-items: center;
  // background-color:red;
`;
const AppAuto = styled.img`
  position: fixed;
  width: 100px;
  height: 100px;
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    right: 0px;
  }
  cursor: pointer;
  bottom: 100px;
  right: 100px;
  z-index: 99;
`;
const AppAutoBg = styled.img`
  position: fixed;
  width: 100px;
  height: 100px;
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    right: 0px;
  }
  cursor: pointer;
  bottom: 100px;
  right: 100px;
  z-index: 99;
`;

const FooterLink = styled.div`
  padding-bottom: 10px;
  @media (max-width: 767px) {
    padding-bottom: 5px;
  }
`;

const FooterLinkWrap = styled.div`
  padding: 80px 0;
  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 20px 0;
    ${CustomGrid} {
      grid-template-columns: 1fr 1fr;
    }
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    ${CustomGrid} ${Text} {
      font-size: 12px;
    }
  }
  @media (min-width: 768px) and (max-width: 1700px) {
    ${CustomGrid} .ft_hd {
      font-size: 17px !important;
    }
  }
  @media (max-width: 767px) {
    padding: 0px 0;
    ${CustomGrid} .ft_hd {
      font-size: 14px !important;
    }
    ${CustomGrid} ${Text} {
      font-size: 12px;
    }
  }
`;

const AnimatedFloat = animated(AppAutoBg);
const Home = Loadable({
  loader: () => import('./Home'),
  loading: Loading,
});
const Profile = Loadable({
  loader: () => import('./Profile'),
  loading: Loading,
});
const Valut = Loadable({
  loader: () => import('./Vault'),
  loading: Loading,
});
const MyBank = Loadable({
  loader: () => import('./MyBank'),
  loading: Loading,
});
const Doc = Loadable({
  loader: () => import('./Doc'),
  loading: Loading,
});
const Bridge = Loadable({
  loader: () => import('./Bridge'),
  loading: Loading,
});
const Governance = Loadable({
  loader: () => import('./Governance'),
  loading: Loading,
});
const MyBankEarn = Loadable({
  loader: () => import('./MyBank/earn'),
  loading: Loading,
});
const MyBankFarming = Loadable({
  loader: () => import('./MyBank/farming'),
  loading: Loading,
});
const MyBankAssetPrice = Loadable({
  loader: () => import('./MyBank/assetPrice'),
  loading: Loading,
});
export default function App() {
  const [chainId, setChainId] = useState(ChainId.heco);
  const [address, setAddress] = useState("");
  const [isAccountLoading, setIsAccountLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  // const [connectToModal, setConnectToModal] = useState(false);



  // const themeDark = useTheme()
  // useEffect(() => {

  //   globalObject.showConnectToModal = () => setConnectToModal(true);
  // }, []);

  useEffect(() => {
    globalObj.showConnectModal = () => setConnectModal(true);

    loadData();
    // provider?.resolveName("heco");

    walletInfo.provider?.on("network", (newNetwork, oldNetwork) => {
      // 当 Provider 进行初始连接时，它会发出一个“network”
      // 事件，并且 oldNetwork 和 newNetwork 为 null。所以，如果
      // oldNetwork 存在，它代表一个变化的网络
      // if(newNetwork.chainId===ChainId.bsc){
      //     window.location.href="http://ifntgame.com/home"
      // }else if(newNetwork.chainId===ChainId.polygon){
      //     window.location.href="https://matic.ifntgame.com/home"
      // }
      if (oldNetwork) {
        // loadData();
        // console.log("刷新了")
        window.location.replace("/home")
      }
    });
    ethereum?.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
      if (accounts[0] !== address && accounts.length) {
        // provider?.lookupAddress(accounts)
        loadData();
      } else {
        setAddress("");

      }
    });
    async function checkWalletConnect() {
      const connectProvider = await createWalletConnectWeb3Provider();
      if (connectProvider.connected) {
        changeAccount(connectProvider.accounts);
        changeChainId(connectProvider.chainId);
      }
      // if(connectProvider.connect)
    }
    checkWalletConnect();
    return () => {
      walletInfo.provider?.off("network");
      ethereum?.off("accountsChanged");
    };
  }, []);

  async function loadData() {
    try {
      setIsAccountLoading(true)
      // console.log(signer,provider)
      setTimeout(() => {
        setIsAccountLoading(false)
      }, 1000);
      if (!walletInfo.signer || !walletInfo.provider) {
        return;
      }

      let networkInfo = await walletInfo.provider?.getNetwork();
      setChainId(networkInfo.chainId);

      // console.log(networkInfo,"networkInfo")
      let addressRes = await walletInfo.signer?.getAddress();
      setAddress(addressRes);
      //  if(window.location.pathname !== '/home') {
      //    globalObj.showConnectModal();
      //  }
      // console.log(networkInfo, addressRes);
    } catch (e) {
      // console.log(e);
    }
  }
  function changeChainId(chainId: number) {
    console.log(chainId, "chainId");
    setChainId(chainId);

  }
  function changeAccount(accounts: string[]) {
    console.log(accounts, "accounts");
    if (accounts[0] !== address && accounts.length) {
      // provider?.lookupAddress(accounts)
      setAddress(accounts[0]);

    } else {
      setAddress("");

    }
  }
  function Updaters() {
    return (
      <>
        <ApplicationUpdater />
        <TransactionUpdater />
      </>
    );
  }
  const faderStyle = useSpring({
    from: { scale: 0.5 },
    to: { scale: 1.5 },
    loop: true,
    config: {
      duration: 1000,
    },
  });
  function disconnect() {
    // console.info(walletInfo.provider)
    // @ts-ignore
    walletInfo.provider.provider.disconnect && walletInfo.provider.provider.disconnect()
    walletInfo.provider = null
    walletInfo.signer = undefined
    setAddress("")
  }
  return (
    <Suspense fallback={<Loading></Loading>}>
      {/* <DownBackground/> */}
      <NetworkTypeContext.Provider value={{ chainId }}>
        <WalletAddressContext.Provider value={{ account: address, isaccountLoading: isAccountLoading, disconnect: disconnect }}>
          <Provider store={store}>
            <Updaters />
            <ThemeProvider>
              <LoadingProvider>
                <AppWrapper>
                  <BodyWrapper
                    style={
                      {
                        // backgroundColor:themeDark?'#121316':'#F1F4F6'
                      }
                    }
                  >
                    <BrowserRouter>
                      {/* <Header /> */}
                      <Switch>
                        <Route exact strict path="/home" component={Home} />
                        <Route exact strict path="/home2" component={Home} />
                        <Route exact strict path="/profile" component={Profile} />
                        <Route exact strict path="/vault" component={Valut} />
                        <Route exact strict path="/myBank" component={MyBank} />
                        <Route exact strict path="/bridge" component={Bridge} />
                        <Route
                          exact
                          strict
                          path="/governance"
                          component={Governance}
                        />
                        <Route exact strict path="/doc" component={Doc} />
                        <Route exact strict path="/test" component={Test} />
                        <Route exact strict path="/press" component={Press} />
                        <Route exact strict path="/myBankEarn" component={MyBankEarn} />
                        <Route exact strict path="/myBankFarming"
                          component={MyBankFarming} />
                        <Route exact strict path="/myBankAssetPrice"
                          component={MyBankAssetPrice} />
                        <Route
                          exact
                          strict
                          path="/news-and-media"
                          component={Press}
                        />
                        <Route
                          exact
                          strict
                          path="/about-us"
                          component={AboutUs}
                        />
                        <Route
                          exact
                          strict
                          path="/new-defi-platform-looks-to-de-risk-the-world-of-crypto"
                          component={News}
                        />
                        <Route
                          exact
                          strict
                          path="/crypto-credit-scoring-protocol-creda-partners-with-filda-to-offer-leveraged-and-low-collateral-lending"
                          component={News}
                        />
                        <Route
                          exact
                          strict
                          path="/former-morgan-stanley-executive-named-as-new-creda-ceo"
                          component={News}
                        />
                        <Route
                          exact
                          strict
                          path="/creda-partners-with-cyberconnect-to-include-social-data-in-crypto-credit-scores"
                          component={News}
                        />
                        <Route component={RedirectPathToHomeOnly} />
                      </Switch>
                    </BrowserRouter>
                    <Popups />
                    <Toasts />
                    <BottomInfo />
                    <WalletConnectModal
                      show={connectModal}
                      onDismiss={() => {
                        setConnectModal(false);
                      }}
                      changeChainId={changeChainId}
                      changeAccount={changeAccount}
                    ></WalletConnectModal>
                    {/* <ConnectToWalletModal
                    show={connectToModal}
                    onDismiss={() => {
                      setConnectToModal(false);
                    }}
                  ></ConnectToWalletModal> */}
                  </BodyWrapper>
                </AppWrapper>
              </LoadingProvider>
            </ThemeProvider>
          </Provider>
        </WalletAddressContext.Provider>
      </NetworkTypeContext.Provider>
    </Suspense>
  );
}
function BottomInfo() {
  return <>{isMobile ? <BottomInfoPhone /> : <BottomInfoWeb />}</>;
}
function BottomInfoPhone() {
  const { t } = useTranslation();
  const themeDark = useTheme();

  return (
    <BottomInfoDiv
      style={{
        backgroundColor: themeDark ? "#0D0D11" : "#F1F4F6",
      }}
    >
      <WrapMaxWidth style={{ width: "100%" }}>
        <FooterLinkWrap>
          <CustomGrid
            templateColumns={"repeat(3, 1fr)"}
            mobTemplateColumns={"1fr 1fr"}
            style={{ alignItems: "baseline", padding: "0 30px" }}
          >
            <div>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={28}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Resources")}
                </Text>
                <Column style={{ paddingTop: "5px" }}>
                  {/*<RowFixed style={{cursor:'pointer'}} onClick={()=>{
                // window.open('https://github.com/CreDA-Protocol')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Media')}</ThemeText>
                </FooterLink>
              </RowFixed>*/}
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper"
                      );
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("WhitePaper")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "https://creda-app.gitbook.io/protocol/guides/arbitrum-guide"
                      );
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Walkthrough")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>

                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = "/news-and-media";
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("News&Media")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open("/press");
                      window.location.href = "/about-us";
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("About Us")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>

                  {/* <RowFixed style={{cursor:'pointer'}} onClick={()=>{
                window.open('https://www.reddit.com/r/CreDAOfficial/')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Reddit')}</ThemeText>
                </FooterLink>
              </RowFixed> */}
                  {/*<RowFixed style={{cursor:'pointer'}} onClick={()=>{
                // window.open('')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Team')}</ThemeText>
                </FooterLink>
              </RowFixed>*/}
                  <SpaceHeight height={20} heightApp={10} />
                </Column>
              </span>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={28}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Development")}
                </Text>
                <Column style={{ paddingTop: "5px" }}>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://creda-app.gitbook.io/creda-protocol/");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Gitbook")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open('')
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("API")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://github.com/CreDA-Protocol");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Github")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                </Column>
              </span>
            </div>
            <div>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={28}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Community")}
                </Text>
                <Column style={{ paddingTop: "5px" }}>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://t.me/CreDAOfficial");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Telegram")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://twitter.com/CreDAfinance");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Twitter")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://discord.com/invite/eSvTm6a6kb");
                      // window.open('https://discord.gg/eSvTm6a6kb')
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Discord")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://www.reddit.com/r/CreDAOfficial/");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Reddit")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://medium.com/@creda-app");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Medium")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                </Column>
              </span>
            </div>
          </CustomGrid>
          <SpaceHeight height={20} heightApp={20} />
        </FooterLinkWrap>
      </WrapMaxWidth>
      <BottomFooterWrap>
        <BottomDown style={{ flexWrap: "wrap" }}>
          <RowFixed style={{ flex: "0 0 100%", justifyContent: "center" }}>
            <ButtonClick
              onClick={() => {
                window.open("https://twitter.com/CreDAfinance");
              }}
            >
              <BottomIcon src={ImageCommon.TwitterIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://github.com/CreDA-Protocol");
              }}
            >
              <BottomIcon src={ImageCommon.GithubIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://t.me/CreDAOfficial");
              }}
            >
              <BottomIcon src={ImageCommon.TelegramIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://www.reddit.com/r/CreDAOfficial/");
              }}
            >
              <BottomRedditIcon src={ImageCommon.Reddit_new} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://discord.com/invite/eSvTm6a6kb");
                // window.open('https://discord.gg/eSvTm6a6kb')
              }}
            >
              <BottomDiscordIcon src={ImageCommon.Discord_new} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                // window.open('https://discord.gg/eSvTm6a6kb')
                window.open("https://medium.com/@creda-app");
              }}
            >
              <BottomMediumIcon src={ImageCommon.MediumIcon} />
            </ButtonClick>
          </RowFixed>
          <Text
            style={{ flex: "0 0 100%", textAlign: "center" }}
            fontSize={21}
            fontColor={"#0ECFF2"}
            fontWeight={"800"}
          >
            {t("CopyrightOnly")} {t("AllRightsReserved")}
          </Text>
        </BottomDown>
      </BottomFooterWrap>
    </BottomInfoDiv>
  );
}
function OldBottomInfoPhone() {
  const { t } = useTranslation();
  const themeDark = useTheme();

  return (
    <BottomInfoPhoneDiv
      style={{
        backgroundColor: themeDark ? "#0D0D11" : "#F1F4F6",
      }}
    >
      <SpaceHeight height={0} heightApp={30} />
      <ColumnNormal style={{ width: "80%", marginLeft: 30 }}>
        <Text fontSize={32} fontColor={"#4F56FF"} fontWeight={"800"}>
          {t("Development")}
        </Text>
        <SpaceHeight height={30} heightApp={30} />
        <Column>
          {/* <a href="https://github.com/CreDA-Protocol"> */}
          <RowFixed
            style={{ cursor: "pointer" }}
            onClick={() => {
              window.open("https://github.com/CreDA-Protocol");
            }}
          >
            <ThemeText fontSize={32}>{t("Github")}</ThemeText>
            <ArrowRightUp src={ImageCommon.arrow_upright_white} />
          </RowFixed>
          {/* </a> */}

          <RowFixed
            style={{ cursor: "pointer" }}
            onClick={() => {
              // window.open('')
            }}
          >
            <ThemeText fontSize={32}>{t("API")}</ThemeText>
            <ArrowRightUp src={ImageCommon.arrow_upright_white} />
          </RowFixed>
        </Column>
      </ColumnNormal>
      <SpaceHeight height={0} heightApp={38} />
      <BottomLineH
        style={{
          backgroundColor: themeDark ? "#22262e" : "#E8E8E8",
        }}
      />
      <SpaceHeight height={0} heightApp={38} />
      <ColumnNormal style={{ width: "80%", marginLeft: 30 }}>
        <Text fontSize={32} fontColor={"#4F56FF"} fontWeight={"800"}>
          {t("Documents")}
        </Text>
        <SpaceHeight height={30} heightApp={30} />
        <Column>
          <a href="https://creda-app.gitbook.io/creda-protocol/">
            <RowFixed style={{ cursor: "pointer" }}>
              <ThemeText fontSize={32}>{t("Intro")}</ThemeText>
              <ArrowRightUp src={ImageCommon.arrow_upright_white} />
            </RowFixed>
          </a>

          <a href="https://creda-app.gitbook.io/creda-protocol/function-modul/infrastructure">
            <RowFixed style={{ cursor: "pointer" }}>
              <ThemeText fontSize={32}>{t("Function")}</ThemeText>
              <ArrowRightUp src={ImageCommon.arrow_upright_white} />
            </RowFixed>
          </a>
          <a href="https://creda-app.gitbook.io/creda-protocol/tokenomics">
            <RowFixed style={{ cursor: "pointer" }}>
              <ThemeText fontSize={32}>{t("Tokenomics")}</ThemeText>
              <ArrowRightUp src={ImageCommon.arrow_upright_white} />
            </RowFixed>
          </a>
          <a href="https://creda-app.gitbook.io/creda-protocol/mining">
            <RowFixed style={{ cursor: "pointer" }}>
              <ThemeText fontSize={32}>{t("Mining")}</ThemeText>
              <ArrowRightUp src={ImageCommon.arrow_upright_white} />
            </RowFixed>
          </a>
          <a href="https://creda-app.gitbook.io/creda-protocol/governance">
            <RowFixed style={{ cursor: "pointer" }}>
              <ThemeText fontSize={32}>{t("Governance")}</ThemeText>
              <ArrowRightUp src={ImageCommon.arrow_upright_white} />
            </RowFixed>
          </a>
        </Column>
      </ColumnNormal>
      <SpaceHeight height={0} heightApp={38} />
      <BottomLineH
        style={{
          backgroundColor: themeDark ? "#22262e" : "#E8E8E8",
        }}
      />
      <RowBetween>
        <PhoneBottomLogo src={ImageCommon.phone_bottom_logo} />
        <Column style={{ paddingRight: 20 }}>
          <ButtonClick
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <Text
              fontSize={32}
              fontColor={themeDark ? "#777E90" : "#121316"}
              fontWeight={"800"}
            >
              {t("Home")}
            </Text>
          </ButtonClick>
          <SpaceHeight height={0} heightApp={24} />
          <ButtonClick
            onClick={() => {
              window.location.href = "/profile";
            }}
          >
            <Text
              fontSize={32}
              fontColor={themeDark ? "#777E90" : "#121316"}
              fontWeight={"800"}
            >
              {t("Getstarted")}
            </Text>
          </ButtonClick>
          <SpaceHeight height={0} heightApp={24} />
          <a href="https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper">
            <ButtonClick>
              <Text
                fontSize={32}
                fontColor={themeDark ? "#777E90" : "#121316"}
                fontWeight={"800"}
              >
                {t("Whitepaper")}
              </Text>
            </ButtonClick>
          </a>
          <SpaceHeight height={0} heightApp={24} />
          <a href="https://creda-app.gitbook.io/creda-protocol/">
            <ButtonClick>
              <Text
                fontSize={32}
                fontColor={themeDark ? "#777E90" : "#121316"}
                fontWeight={"800"}
              >
                {t("Protocal Litepaper")}
              </Text>
            </ButtonClick>
          </a>
        </Column>
      </RowBetween>
      <BottomLineH
        style={{
          backgroundColor: themeDark ? "#22262e" : "#E8E8E8",
        }}
      />
      <SpaceHeight height={0} heightApp={25} />
      <RowCenter>
        {/* <a href="https://twitter.com/CreDAfinance"> */}
        <ButtonClick
          onClick={() => {
            window.open("https://twitter.com/CreDAfinance");
          }}
        >
          <BottomIcon src={ImageCommon.Vector_icon} />
        </ButtonClick>
        {/* </a> */}
        <SpaceWidth width={0} widthApp={30} />
        {/* <a href="https://github.com/CreDA-Protocol"> */}
        <ButtonClick
          onClick={() => {
            window.open("https://github.com/CreDA-Protocol");
          }}
        >
          <BottomIcon src={ImageCommon.github_icon} />
        </ButtonClick>
        {/* </a> */}
        <SpaceWidth width={0} widthApp={30} />
        <a href="https://t.me/CreDAOfficial">
          <ButtonClick>
            <BottomIcon src={ImageCommon.telegram_icon} />
          </ButtonClick>
        </a>
      </RowCenter>
      <SpaceHeight height={0} heightApp={25} />
      <BottomLineH
        style={{
          backgroundColor: themeDark ? "#22262e" : "#E8E8E8",
        }}
      />
      <SpaceHeight height={0} heightApp={15} />
      <RowCenter>
        <Text fontSize={24} fontColor={"#777E90"} dangerouslySetInnerHTML={{ __html: t("Copyright") }}>

        </Text>
      </RowCenter>
    </BottomInfoPhoneDiv>
  );
}

function BottomInfoWeb() {
  const { t } = useTranslation();
  const themeDark = useTheme();

  return (
    <BottomInfoDiv
      style={{
        backgroundColor: themeDark ? "#0D0D11" : "#F1F4F6",
      }}
    >
      <WrapMaxWidth style={{ width: "100%" }}>
        <FooterLinkWrap>
          <CustomGrid
            templateColumns={"repeat(3, 1fr)"}
            style={{ alignItems: "baseline" }}
          >
            <RowCenter>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={20}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Resources")}
                </Text>
                <Column style={{ paddingTop: "20px" }}>
                  {/* <RowFixed style={{cursor:'pointer'}} onClick={()=>{
                // window.open('https://github.com/CreDA-Protocol')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Media')}</ThemeText>
                </FooterLink>
              </RowFixed>*/}
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper"
                      );
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("WhitePaper")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "https://creda-app.gitbook.io/protocol/guides/arbitrum-guide"
                      );
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Walkthrough")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open("/press");
                      window.location.href = "/news-and-media";
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("News&Media")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = "/about-us";
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("About Us")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>

                  {/* <RowFixed style={{cursor:'pointer'}} onClick={()=>{
                window.open('https://www.reddit.com/r/CreDAOfficial/')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Reddit')}</ThemeText>
                </FooterLink>
              </RowFixed> */}
                  {/*<RowFixed style={{cursor:'pointer'}} onClick={()=>{
                // window.open('')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Team')}</ThemeText>
                </FooterLink>
              </RowFixed>*/}
                </Column>
              </span>
            </RowCenter>
            <RowCenter>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={20}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Development")}
                </Text>
                <Column style={{ paddingTop: "20px" }}>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://creda-app.gitbook.io/creda-protocol/");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Gitbook")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open('')
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("API")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://github.com/CreDA-Protocol/");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Github")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                </Column>
              </span>
            </RowCenter>
            <RowCenter>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={20}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Community")}
                </Text>
                <Column style={{ paddingTop: "20px" }}>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://t.me/CreDAOfficial");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Telegram")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://twitter.com/CreDAfinance");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Twitter")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open('https://discord.gg/eSvTm6a6kb')
                      window.open("https://discord.com/invite/eSvTm6a6kb");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Discord")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://www.reddit.com/r/CreDAOfficial/");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Reddit")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://medium.com/@creda-app");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={20} fontWeight={800}>
                        {t("Medium")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                </Column>
              </span>
            </RowCenter>
          </CustomGrid>
        </FooterLinkWrap>
      </WrapMaxWidth>
      <BottomFooterWrap>
        <BottomDown>
          <Text fontSize={21} fontColor={"#0ECFF2"} fontWeight={"800"} dangerouslySetInnerHTML={{ __html: t("Copyright") }}>

          </Text>
          <RowFixed>
            <ButtonClick
              onClick={() => {
                window.open("https://twitter.com/CreDAfinance");
              }}
            >
              <BottomIcon src={ImageCommon.TwitterIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://github.com/CreDA-Protocol");
              }}
            >
              <BottomIcon src={ImageCommon.GithubIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://t.me/CreDAOfficial");
              }}
            >
              <BottomIcon src={ImageCommon.TelegramIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://www.reddit.com/r/CreDAOfficial/");
              }}
            >
              <BottomRedditIcon src={ImageCommon.Reddit_new} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                // window.open('https://discord.gg/eSvTm6a6kb')
                window.open("https://discord.com/invite/eSvTm6a6kb");
              }}
            >
              <BottomDiscordIcon src={ImageCommon.Discord_new} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                // window.open('https://discord.gg/eSvTm6a6kb')
                window.open("https://medium.com/@creda-app");
              }}
            >
              <BottomMediumIcon src={ImageCommon.MediumIcon} />
            </ButtonClick>
          </RowFixed>
        </BottomDown>
      </BottomFooterWrap>
    </BottomInfoDiv>
  );
}

function OldBottomInfoWeb() {
  const { t } = useTranslation();
  const themeDark = useTheme();
  return (
    <BottomInfoDiv
      style={{
        backgroundColor: themeDark ? "#0D0D11" : "#F1F4F6",
      }}
    >
      <RowCenter>
        <RowBetween style={{ width: 900 }}>
          <ColumnBetween style={{ height: 180 }}>
            <ButtonClick
              onClick={() => {
                window.scrollTo(0, 0);
              }}
            >
              <Text
                fontSize={16}
                fontColor={themeDark ? "#777E90" : "#121316"}
                fontWeight={"800"}
              >
                {t("Home")}
              </Text>
            </ButtonClick>
            <ButtonClick
              onClick={() => {
                window.location.href = "/profile";
              }}
            >
              <Text
                fontSize={16}
                fontColor={themeDark ? "#777E90" : "#121316"}
                fontWeight={"800"}
              >
                {t("Getstarted")}
              </Text>
            </ButtonClick>
            <a href="https://creda.app/img/creda_whitepaper.pdf">
              <ButtonClick>
                <Text
                  fontSize={16}
                  fontColor={themeDark ? "#777E90" : "#121316"}
                  fontWeight={"800"}
                >
                  {t("Whitepaper")}
                </Text>
              </ButtonClick>
            </a>
            <a href="https://creda-app.gitbook.io/creda-protocol/">
              <ButtonClick>
                <Text
                  fontSize={16}
                  fontColor={themeDark ? "#777E90" : "#121316"}
                  fontWeight={"800"}
                >
                  {t("Protocal Litepaper")}
                </Text>
              </ButtonClick>
            </a>
          </ColumnBetween>
          <BottomLineV
            style={{
              backgroundColor: themeDark ? "#22262e" : "#E8E8E8",
            }}
          />
          <ColumnBetween style={{ height: 180, justifyContent: "flex-start" }}>
            <Text fontSize={16} fontColor={"#4F56FF"} fontWeight={"800"}>
              {t("Development")}
            </Text>
            <SpaceHeight height={30} heightApp={30} />
            <Column>
              {/* <a href="https://github.com/CreDA-Protocol"> */}
              <RowFixed
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open("https://github.com/CreDA-Protocol");
                }}
              >
                <ThemeText fontSize={16}>{t("Github")}</ThemeText>
                <ArrowRightUp src={ImageCommon.arrow_upright_white} />
              </RowFixed>
              {/* </a> */}
              <RowFixed
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // window.open('')
                }}
              >
                <ThemeText fontSize={16}>{t("API")}</ThemeText>
                <ArrowRightUp src={ImageCommon.arrow_upright_white} />
              </RowFixed>
            </Column>
            <SpaceHeight height={0} heightApp={30} />
          </ColumnBetween>
          <BottomLineV
            style={{
              backgroundColor: themeDark ? "#22262e" : "#E8E8E8",
            }}
          />
          <ColumnBetween style={{ height: 180, justifyContent: "flex-start" }}>
            <Text fontSize={16} fontColor={"#4F56FF"} fontWeight={"800"}>
              {t("Documents")}
            </Text>
            <SpaceHeight height={30} heightApp={30} />
            <Column>
              <a href="https://creda-app.gitbook.io/creda-protocol/">
                <RowFixed style={{ cursor: "pointer" }}>
                  <ThemeText fontSize={16}>{t("Intro")}</ThemeText>
                  <ArrowRightUp src={ImageCommon.arrow_upright_white} />
                </RowFixed>
              </a>
              <a href="https://creda-app.gitbook.io/creda-protocol/function-modul/infrastructure">
                <RowFixed style={{ cursor: "pointer" }}>
                  <ThemeText fontSize={16}>{t("Function")}</ThemeText>
                  <ArrowRightUp src={ImageCommon.arrow_upright_white} />
                </RowFixed>
              </a>
              <a href="https://creda-app.gitbook.io/creda-protocol/tokenomics">
                <RowFixed style={{ cursor: "pointer" }}>
                  <ThemeText fontSize={16}>{t("Tokenomics")}</ThemeText>
                  <ArrowRightUp src={ImageCommon.arrow_upright_white} />
                </RowFixed>
              </a>
              <a href="https://creda-app.gitbook.io/creda-protocol/mining">
                <RowFixed style={{ cursor: "pointer" }}>
                  <ThemeText fontSize={16}>{t("Mining")}</ThemeText>
                  <ArrowRightUp src={ImageCommon.arrow_upright_white} />
                </RowFixed>
              </a>
              <a href="https://creda-app.gitbook.io/creda-protocol/governance">
                <RowFixed style={{ cursor: "pointer" }}>
                  <ThemeText fontSize={16}>{t("Governance")}</ThemeText>
                  <ArrowRightUp src={ImageCommon.arrow_upright_white} />
                </RowFixed>
              </a>
            </Column>
          </ColumnBetween>
        </RowBetween>
      </RowCenter>
      <BottomLineH
        style={{
          backgroundColor: themeDark ? "#22262e" : "#E8E8E8",
        }}
      />
      <BottomDown>
        <Text fontSize={12} fontColor={"#777E90"} dangerouslySetInnerHTML={{ __html: t("Copyright") }}>

        </Text>
        <RowFixed>
          {/* <a href="https://twitter.com/CreDAfinance"> */}
          <ButtonClick
            onClick={() => {
              window.open("https://twitter.com/CreDAfinance");
            }}
          >
            <BottomIcon src={ImageCommon.Vector_icon} />
          </ButtonClick>
          {/* </a> */}
          <SpaceWidth width={60} widthApp={30} />
          {/* <a href="https://github.com/CreDA-Protocol"> */}
          <ButtonClick
            onClick={() => {
              window.open("https://github.com/CreDA-Protocol");
            }}
          >
            <BottomIcon src={ImageCommon.github_icon} />
          </ButtonClick>
          {/* </a> */}
          <SpaceWidth width={60} widthApp={30} />
          <a href="https://t.me/CreDAOfficial">
            <ButtonClick>
              <BottomIcon src={ImageCommon.telegram_icon} />
            </ButtonClick>
          </a>
        </RowFixed>
      </BottomDown>
    </BottomInfoDiv>
  );
}

const BottomInfoPhoneDiv = styled(Column)`
  background-color: #0d0d11;
  padding: 0px 0px 25px 0px;
  width: 100%;
`;
const BottomInfoDiv = styled(Column)`
  height: 100%;
  //height:410px;
  width: 100%;
  background-color: #121316;
  @media (max-width: 767px) {
    padding-top: 20px;
  }
`;
const BottomLineH = styled.div`
  height: 1px;
  width: 100%;
  background-color: #22262e;
`;
const BottomLineV = styled.div`
  width: 1px;
  background-color: #22262e;
  margin: 0px 40px;
  height: 340px;
`;
const BottomDown = styled(RowBetween)`
  height: 121px;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  @media (min-width: 1610px) {
    max-width: 1589px;
  }
  @media (max-width: 1190px) {
    height: 76px;
    max-width: 100%;
    padding-left: 30px;
    padding-right: 30px;
  }
`;
const BottomIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 16px;
  }
`;
const BottomDiscordIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 23px;
  }
`;
const BottomRedditIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 23px;
  }
`;
const BottomMediumIcon = styled.img`
  height: 21px;
  @media (max-width: 767px) {
    height: 23px;
  }
`;
const ArrowRightUp = styled.img`
  height: 4px;
  width: 4px;
  margin-top: 5px;
  margin-left: 5px;
`;
const PhoneBottomLogo = styled.img`
  width: 193px;
`;

const BottomFooterWrap = styled.div`
  background: linear-gradient(
    90.02deg,
    #0e042f 0.64%,
    #3a058e 38.41%,
    #451edb 60.15%,
    #04b0ff 99.99%
  );
  @media (min-width: 768px) and (max-width: 1700px) {
    ${Text} {
      font-size: 17px;
    }
    ${BottomIcon} {
      height: 17px;
    }
  }
`;
