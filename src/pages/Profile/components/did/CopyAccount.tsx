import { ImageCommon } from "@assets/common/ImageCommon";
import { FlexView } from "@components/Common";
import { message } from "antd";
import copy from "copy-to-clipboard";
import { AddressText, CopyIcon } from "../StyledComponents";

// copy账号
export function CopyAccount({ account, originAccount }: any) {
  return (
    <FlexView>
      <AddressText fontColor={"#777E90"} fontSize={14} fontWeight={"bold"}>
        DID:{account}
      </AddressText>
      <CopyIcon
        onClick={() => {
          copy(originAccount);
          message.success("copy success");
        }}
        src={ImageCommon.CopyIcon}
      />
    </FlexView>
  );
}