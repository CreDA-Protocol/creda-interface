import React from "react";
import { ChainIds } from "../common/Common";

export const WalletAddressContext = React.createContext({
  account: "",
  isaccountLoading: false,
  disconnect: () => { }
});

export const WalletTypeContext = React.createContext(null);

/**
 * Active network
 */
export const NetworkTypeContext = React.createContext({
  chainId: ChainIds.arbitrum
});

export const Web3Context = React.createContext(null);