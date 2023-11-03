import { formatBalance, formatPercent } from "@common/Common";
import { Column } from "@components/Column";
import { CardPairOrigin } from "@components/Common";
import { RowBetween, RowFixed } from "@components/Row";
import { ThemeTextEqure } from "@components/ThemeComponent";
import { ProfileProjectsConfig } from "../../configs/projectsConfig";

export function ProjectBankListMobile({ item, name, tokensKey }: any) {
  const tokens = item[tokensKey] || [];
  const unclaimToken =
    item[ProfileProjectsConfig[name]?.unclaimKey]?.[0] ||
    item[ProfileProjectsConfig[name]?.unclaimKey] ||
    {};
  item.amount = Math.max(item.balance || 0, item.amount || 0);
  unclaimToken.amount = Math.max(
    unclaimToken.balance || 0,
    unclaimToken.amount || 0
  );

  if (!tokens.length) {
    if (["yfii", "keeperdao", "dodo", "hegic", "wepiggy"].indexOf(name) >= 0) {
      item.icon = tokens.icon;
      item.symbol = tokens.symbol;
    }
    if (["dodo", "dusd"].indexOf(name) >= 0) {
      item.amount = Math.max(item.amount || 0, tokens.amount || 0);
      item.value = Math.max(item.value || 0, tokens.value || 0);
    }
    const icons = [item.icon];
    const pairs = [item.symbol];

    return (
      <Column style={{ padding: 10 }}>
        <div
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#2E313A",
            marginBottom: 20,
          }}
        ></div>
        <RowBetween>
          <RowFixed>
            <CardPairOrigin pairs={pairs} icons={icons} showTitle={false} />
            <Column>
              <ThemeTextEqure fontWeight={"600"} fontSize={15}>
                {formatBalance(item.amount)} {item.symbol}
              </ThemeTextEqure>
              <ThemeTextEqure fontSize={12}>
                ${formatBalance(item.value)}
              </ThemeTextEqure>
            </Column>
          </RowFixed>
          <Column style={{ alignItems: "flex-end" }}>
            <ThemeTextEqure fontWeight={"600"} fontSize={15}>
              {formatBalance(unclaimToken.amount)} {unclaimToken.symbol}($
              {formatBalance(unclaimToken.value)})
            </ThemeTextEqure>
            <ThemeTextEqure fontSize={12}>
              {formatPercent(item.apy)}
            </ThemeTextEqure>
          </Column>
        </RowBetween>
      </Column>
    );
  }

  const icons = tokens.map((item: any, index: number) => {
    return item.icon;
  });
  const pairs = tokens.map((item: any, index: number) => {
    return item.symbol;
  });
  const balance = tokens.map((item: any, index: number) => {
    return (
      formatBalance(Math.max(item.amount || 0, item.balance || 0)) + item.symbol
    );
  });
  return (
    <Column style={{ padding: 10 }}>
      <div
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#2E313A",
          marginBottom: 20,
        }}
      ></div>
      <RowBetween>
        <RowFixed>
          <CardPairOrigin pairs={pairs} icons={icons} showTitle={false} />
          <Column>
            <ThemeTextEqure fontWeight={"600"} fontSize={15}>
              {balance.join("+")}
            </ThemeTextEqure>
            <ThemeTextEqure fontSize={12}>
              ${formatBalance(item.value)}
            </ThemeTextEqure>
          </Column>
        </RowFixed>
        <Column style={{ alignItems: "flex-end" }}>
          <ThemeTextEqure fontWeight={"600"} fontSize={15}>
            {formatBalance(unclaimToken.amount)} {unclaimToken.symbol}($
            {formatBalance(unclaimToken.value)})
          </ThemeTextEqure>
          <ThemeTextEqure fontSize={12}>
            {formatPercent(item.apy)}
          </ThemeTextEqure>
        </Column>
      </RowBetween>
    </Column>
  );
}