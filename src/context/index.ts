import React from "react";
import { ChainId } from "../common/Common";

export const WalletAddressContext = React.createContext({ account: "", isaccountLoading: false, disconnect: () => { } })
export const WalletTypeContext = React.createContext(null)
export const NetworkTypeContext = React.createContext({ chainId: ChainId.arbitrum })
export const Web3Context = React.createContext(null)