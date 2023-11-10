import { ChainId } from "@lychees/uniscam-sdk";
import { getUSDTokenPriceBySymbol } from "@services/pricing.service";
import { fetchTokenBalance } from "@services/tokens.service";
import { BehaviorSubject } from "rxjs";
import { deletePortfolioApprovalCache } from "../portfolio.service";
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

  constructor() {
    // Every time an allowance value of one of the spenders changes, compute the exposure value
    this.spenders.subscribe(spenders => {
      spenders?.forEach(spender => spender.allowance$.subscribe(() => this.updateExposureUSD()));
    });
  }

  public static async fromApiApproval(apiApproval: PortfolioApiApproval, account: string, chainId: ChainId): Promise<PortfolioApprovedToken> {
    const token: PortfolioApprovedToken = new PortfolioApprovedToken();

    if (!apiApproval.contract)
      return null;

    if (typeof apiApproval.contract === "string") {
      // For now we don't handle contracts that don't come with enough info. We could fetch symbol from chain though.
      return null;
    }
    else {
      // Full contract object
      // Looks like an invalid token info we got from the approval api (happens with TIN)
      if (!apiApproval.contract.address || !apiApproval.contract.symbol)
        return null;

      token.icon = apiApproval.contract.icon;
      token.address = apiApproval.contract.address;
      token.symbol = apiApproval.contract.symbol;
    }

    token.chainId = chainId;

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

  /**
   * Based on spenders allowance status, compute the total amount of US user can loose on this token.
   */
  private async updateExposureUSD() {
    const price = await getUSDTokenPriceBySymbol(this.symbol);
    const balance = await fetchTokenBalance(this.account, this.address, this.chainId);
    const userUSDBalance = balance * price;

    if (price === null || balance === null) {
      // Unable to know, UI will have to display that
      this.sumExposureUsd$.next(null);
      return;
    }

    let totalSpendersExposureUSD = 0;
    for (const spender of this.spenders.value) {
      const spenderAllowanceUSD = parseFloat(spender.allowance$.value) * price;
      totalSpendersExposureUSD += spenderAllowanceUSD;
    }

    // Real exposure is the MIN of what user has and what spenders can spend
    this.sumExposureUsd$.next(Math.min(userUSDBalance, totalSpendersExposureUSD));
  }

  /**
   * Deletes the spender from the local model.
   */
  public removeSpender(spender: PortfolioApprovedSpender) {
    this.spenders.next(this.spenders.value.filter(s => s.address !== spender.address));
    deletePortfolioApprovalCache(this.account, this.chainId);
  }
}