import { ChainIds } from "@services/chain.service";
import React from "react";

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