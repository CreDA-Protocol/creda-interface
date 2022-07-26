import axios from "axios";

export function getCoinPrice(coinidList:any,callBack:any) {
  const url = `https://api.glidefinance.io/subgraphs/name/glide/exchange`;
  const params ={
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
  axios.post(url,params).then((res:any)=>{
        console.log(res.data.data.now)
        callBack(res.data.data.now)
      }).catch((e:any)=>{
        console.log('getCoinPrice==',e);
      })
}