import { ChainId } from "@lychees/uniscam-sdk";
import { getUSDTokenPriceBySymbol } from "@services/pricing.service";
import { BehaviorSubject } from "rxjs";
import { PortfolioApiApproval } from "./portfolio-api.dto";
import { PortfolioApprovedSpender } from "./portfolio-approved-spender";

/**
 * User wallet's token for which external projects have authorization to spend
 */
export type PortfolioApprovedTokenDTO = {
  icon: string;
  address: string; // ERC20 token address
  symbol: string;
  chainId: ChainId;
  spenders: PortfolioApprovedSpender[]; // List of contracts/projects allowed to spend this token
}

export class PortfolioApprovedToken {
  // Token info
  public icon: string = null;
  public address: string = null;
  public symbol: string = null;
  public sumExposureUsd$ = new BehaviorSubject<number>(null); // Total amount of user's balance, in USD, of this token, at risk from spenders approvals
  public spenders = new BehaviorSubject<PortfolioApprovedSpender[]>(null);

  // Context
  public account: string; // User account used to check for approvals
  public chainId: ChainId; // Chain ID used to check for approvals

  public static async fromApiApproval(apiApproval: PortfolioApiApproval, account: string, chainId: ChainId): Promise<PortfolioApprovedToken> {
    const token: PortfolioApprovedToken = new PortfolioApprovedToken();

    // Looks like an invalid token info we got from the approval api (happens with TIN)
    if (!apiApproval.contract.address || !apiApproval.contract.symbol)
      return null;

    token.icon = apiApproval.contract.icon;
    token.address = apiApproval.contract.address;
    token.symbol = apiApproval.contract.symbol;
    token.chainId = chainId;

    console.log("token.symbol", token.symbol)

    const spenders: PortfolioApprovedSpender[] = [];
    for (const approved of apiApproval.approved) {
      const spender = await PortfolioApprovedSpender.fromApiApprovedSpender(approved, account, chainId, token);
      spenders.push(spender);
    }
    token.spenders.next(spenders);

    token.account = account;
    token.chainId = chainId;

    return token;
  }

  constructor() {
    // Every time an allowance value of one of the spenders changes, compute the exposure value
    this.spenders.subscribe(spenders => {
      spenders?.forEach(spender => spender.allowance$.subscribe(() => this.updateExposureUSD()));
    });
  }

  private async updateExposureUSD() {
    for (const spender of this.spenders.value) {
      const price = await getUSDTokenPriceBySymbol(this.symbol);
      console.log("PRICE", this.symbol, price);
      // TODO: get token market price
      // TODO: get token user balance
      // TODO: multiply balance by price, multiply lalowance by price -> exposure is the MIN of both
    }
  }
}