import { Column } from "@components/Column";
import axios from "axios";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { chainIndexToId } from "../../configs/chainsConfig";
import { Wrap } from "../Wrap";
import { PortfolioDiv } from "./PortfolioDiv";
import { PortfolioPhoneDiv } from "./PortfolioPhoneDiv";

export function PortfolioItem() {
  const [chainIndex, setChainIndex] = useState(0);
  const [defiProject, setDefiProject] = useState<Object>({});

  useEffect(() => {
    async function getResult() {
      try {
        const originUrl = `https://defi-app.whatscoin.com/dgg/account/defi?lang=cn`;
        let res = await axios.get(originUrl);
        let obj: any = {};
        res.data.data.forEach((item: any, index: number) => {
          // console.log(item)
          if (!obj[item.chainName]) {
            obj[item.chainName] = {};
          }
          obj[item.chainName][item.name] = item;
        });
        setDefiProject(obj);
      } catch (e) {
        console.warn("PortfolioItem", e)
      }
    }

    getResult();
  }, []);

  function changChainIndex(index: number) {
    setChainIndex(index);
  }

  return (
    <Column style={{ width: "100%" }}>
      <Wrap onIndexChange={changChainIndex} selectIndex={chainIndex} />
      {isMobile ? (
        <PortfolioPhoneDiv
          project={defiProject}
          chainType={chainIndexToId[chainIndex]}
        />
      ) : (
        <PortfolioDiv project={defiProject} chainType={chainIndexToId[chainIndex]} />
      )}
    </Column>
  );
}