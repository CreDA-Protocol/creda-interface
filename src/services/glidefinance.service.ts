import axios, { AxiosResponse } from "axios";

export type GlidePrice = {
  derivedELA: string;
  derivedUSD: string;
  id: string;  // token contract address
  name: string;
  symbol: string;
  totalLiquidity: string;
  totalTransactions: string;
  tradeVolumeUSD: string;
}

export type GlideData = {
  data: {
    now: GlidePrice[]
  }
}

export function getCoinPrice(coinidList: string): Promise<GlidePrice[]> {
  return new Promise(resolve => {
    const url = `https://api.glidefinance.io/subgraphs/name/glide/exchange`;
    const params = {
      "query": "\n" +
        "      query tokens {\n" +
        "        now: tokens(\n" +
        `      where: {id_in:${coinidList}}\n` +
        "      \n" +
        "      orderBy: tradeVolumeUSD\n" +
        "      orderDirection: desc\n" +
        "    ) {\n" +
        "      id\n" +
        "      symbol\n" +
        "      name\n" +
        "      derivedELA\n" +
        "      derivedUSD\n" +
        "      tradeVolumeUSD\n" +
        "      totalTransactions\n" +
        "      totalLiquidity\n" +
        "    }\n" +
        "      }\n" +
        "    "
    }
    axios.post(url, params).then((res: AxiosResponse<GlideData>) => {
      resolve(res.data.data.now);
    }).catch((e: any) => {
      console.warn('getCoinPrice error', e);
    })
  });
}