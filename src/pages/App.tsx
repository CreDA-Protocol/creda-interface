import Loading from "@components/Loading";
import Popups from "@components/Popups";
import Toasts from "@components/Toasts";
import WalletConnectModal from "@components/WalletConnectModal";
import { ChainIds } from "@services/chain.service";
import { Suspense, useEffect, useState } from "react";
import Loadable from 'react-loadable';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSpring } from 'react-spring';
import styled from 'styled-components';
import {
  ethereum,
  globalObj,
  walletInfo
} from "../common/Common";
import { NetworkTypeContext, WalletAddressContext } from "../contexts";
import "../i18n";
import LoadingProvider from "../provider/LoadingProvider";
import store from "../states";
import ApplicationUpdater from "../states/application/updater";
import TransactionUpdater from "../states/transactions/updater";
import ThemeProvider from "../theme";
import AboutUs from "./AboutUs";
import { RedirectPathToHomeOnly } from "./Home/redirects";
import Press from "./Press";
import News from "./Press/News";

import "@assets/css/custom.css";
import { createWalletConnectWeb3Provider } from "@services/wallet-connect.service";
import { Footer } from "./components/Footer/Footer";

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

// Asynchronous loading of pages
const Home = Loadable({ loader: () => import('./Home'), loading: Loading });
const Profile = Loadable({ loader: () => import('./Profile'), loading: Loading });
const Valut = Loadable({ loader: () => import('./Vault'), loading: Loading });
const MyBank = Loadable({ loader: () => import('./MyBank'), loading: Loading });
const Doc = Loadable({ loader: () => import('./Doc'), loading: Loading });
const Bridge = Loadable({ loader: () => import('./Bridge'), loading: Loading });
const Governance = Loadable({ loader: () => import('./Governance'), loading: Loading });
const MyBankEarn = Loadable({ loader: () => import('./MyBank/earn'), loading: Loading });
const MyBankFarming = Loadable({ loader: () => import('./MyBank/farming'), loading: Loading });
const MyBankAssetPrice = Loadable({ loader: () => import('./MyBank/assetPrice'), loading: Loading });

export default function App() {
  const [chainId, setChainId] = useState(ChainIds.esc);
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
      // When the Provider establishes an initial connection, it emits a "network"
      // event with oldNetwork and newNetwork set to null. Therefore, if oldNetwork exists,
      // it represents a changed network.
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

    const onAccountsChanged = (accounts: string[]) => {
      console.log(accounts);
      if (accounts[0] !== address && accounts.length) {
        // provider?.lookupAddress(accounts)
        loadData();
      } else {
        setAddress("");
      }
    }

    // ethereum: injected by metamask
    (ethereum as any)?.on("accountsChanged", onAccountsChanged);

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
      (ethereum as any)?.removeListener("accountsChanged", onAccountsChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

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
    console.log("change chain Id", chainId);
    setChainId(chainId);
  }

  function changeAccount(accounts: string[]) {
    console.log("change accounts", accounts);
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
                    <Footer />
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