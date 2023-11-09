import { bigNumberToBalance } from "@common/Common";
import { ChainId } from "@services/chain.service";
import { fetchTokenAllowance, getTokenDecimals } from "@services/tokens.service";
import { AdvancedBehaviorSubject } from "src/model/advanced-behavior-subject";
import { PortfolioApiApprovedSpender } from "./portfolio-api.dto";
import { PortfolioApprovedToken } from "./portfolio-approved-token";

export class PortfolioApprovedSpender {
  // Spender info
  public icon: string;
  public name: string;
  public address: string;
  public allowance$ = new AdvancedBehaviorSubject<string>(null, () => this.fetchAllowance()); // spending allowance for this spender, in number of readable tokens

  // Context
  public account: string; // User account used to check for approvals
  public chainId: ChainId; // Chain ID used to check for approvals
  public approvedToken: PortfolioApprovedToken; // Related approved token

  public static async fromApiApprovedSpender(json: PortfolioApiApprovedSpender, account: string, chainId: ChainId, approvedToken: PortfolioApprovedToken): Promise<PortfolioApprovedSpender> {
    const spender: PortfolioApprovedSpender = new PortfolioApprovedSpender();

    spender.icon = json.approved.farm?.icon || null;
    spender.name = json.approved.farm?.name || "Unknown contract / app";
    spender.address = json.approved.address;

    spender.account = account;
    spender.chainId = chainId;
    spender.approvedToken = approvedToken;

    return spender;
  }

  private async fetchAllowance(): Promise<string> {
    const decimals = await getTokenDecimals(this.chainId, this.approvedToken.address);
    const allowance = await fetchTokenAllowance(this.approvedToken.address, this.account, this.address, this.chainId);
    return bigNumberToBalance(allowance, decimals);
  }
}