import { CloseOutlined } from "@ant-design/icons";
import errorJson from "@assets/lottie/creda_action_error.json";
import loadingJson from "@assets/lottie/creda_action_loading.json";
import successJson from "@assets/lottie/creda_action_success.json";
import { Lottie } from "@crello/react-lottie";
import { createContext, useContext, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { colors, formatAccount } from "../common/Common";
import { RowEnd } from "../components/Row";
import { NetworkTypeContext } from "../contexts";
import { useTheme } from "../state/application/hooks";
import { getScanLink, getScanName } from "../utils";

export enum LoadingType {
    confirm = 0,
    pending = 1,
    error = 2,
    success = 3
}

export const LoadingContext = createContext({
    show: (type: LoadingType, message: string) => {

    },
    hide: () => { }
})

export function useLoadingContext() {
    const loadingContext = useContext(LoadingContext)
    return loadingContext
}

export default function LoadingProvider({ children }: any) {

    const [visible, setVisible] = useState(false)
    const [type, setType] = useState(LoadingType.confirm)
    const [message, setMessage] = useState("")
    return (
        <LoadingContext.Provider
            value={{
                show: (type, message) => {
                    setType(type)
                    setMessage(message)
                    setVisible(true)
                },
                hide: () => {
                    setVisible(false)
                }
            }}
        >
            {children}
            <Loading
                visible={visible}
                type={type}
                message={message}
                onClose={() => setVisible(false)}
            ></Loading>
        </LoadingContext.Provider>
    )
}

function Loading({ visible, type, message, onClose }: any) {
    const { chainId } = useContext(NetworkTypeContext);
    const themeDark = useTheme()
    if (!visible) {
        return null;
    }
    return (
        <LoadingContainer>
            <LoadingContent
                dark={Boolean(themeDark)}
            >
                <RowEnd>
                    <CloseOutlined
                        style={{ color: themeDark ? colors.white : colors.black, fontSize: isMobile ? "16px" : "22px", cursor: "pointer" }}
                        onClick={onClose}
                    />
                </RowEnd>
                <LottieView>
                    {[LoadingType.confirm, LoadingType.pending].includes(type) && <Lottie
                        speed={0.5}
                        config={{
                            loop: true,
                            autoplay: true,
                            animationData: loadingJson,
                        }} />}
                    {type === LoadingType.error && <Lottie
                        // speed={0.5}
                        config={{
                            loop: true,
                            autoplay: true,
                            animationData: errorJson,
                        }} />}
                    {type === LoadingType.success && <Lottie
                        // speed={0.5}
                        config={{
                            loop: true,
                            autoplay: true,
                            animationData: successJson,
                        }} />}
                </LottieView>
                {type === LoadingType.confirm && <>
                    <LoadingTitle
                        dark={Boolean(themeDark)}
                    >
                        Waiting for Confirmation
                    </LoadingTitle>
                    <LoadingDesc
                        dark={Boolean(themeDark)}
                    >
                        {message}
                    </LoadingDesc>
                    <LoadingTips
                        dark={Boolean(themeDark)}
                    >
                        Confirm this transaction in your wallet
                    </LoadingTips>
                </>}
                {type === LoadingType.pending && <>
                    <LoadingTitle
                        dark={Boolean(themeDark)}
                    >
                        Waiting for Transaction
                    </LoadingTitle>
                    <LoadingDesc
                        dark={Boolean(themeDark)}
                    >
                        Transaction Hash: {formatAccount(message)}
                    </LoadingDesc>
                    <LoadingHashView
                        dark={Boolean(themeDark)}
                        onClick={() => {
                            window.open(getScanLink(chainId, message, "transaction"))
                        }}
                    >
                        View On {getScanName(chainId)}
                    </LoadingHashView>
                </>}
                {type === LoadingType.error && <>
                    <LoadingTitle
                        dark={Boolean(themeDark)}
                    >
                        Transaction Error
                    </LoadingTitle>
                    <LoadingDesc
                        dark={Boolean(themeDark)}
                    >
                        {message}
                    </LoadingDesc>

                </>}
                {type === LoadingType.success && <>
                    <LoadingTitle
                        dark={Boolean(themeDark)}
                    >
                        Transaction Success
                    </LoadingTitle>
                    <LoadingDesc
                        dark={Boolean(themeDark)}
                    >
                        Transaction Hash: {formatAccount(message)}
                    </LoadingDesc>
                    <LoadingHashView
                        dark={Boolean(themeDark)}
                        onClick={() => {
                            window.open(getScanLink(chainId, message, "transaction"))
                        }}
                    >
                        View On {getScanName(chainId)}
                    </LoadingHashView>
                </>}
            </LoadingContent>
        </LoadingContainer>
    )
}
const LoadingContainer = styled.div`
    position:fixed;
    left:0;
    top:0;
    bottom:0;
    right:0;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:999999;
    background-color:rgba(0,0,0,0.2);
`
const LoadingContent = styled.div<{ dark: boolean }>`
    background-color:${props => props.dark ? colors.dark_background : colors.white};
    padding:20px;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    width:400px;
    border-radius:10px;
    @media (max-width: 768px) {
        padding:10px;
        width:80%;
    }
`
const LottieView = styled.div`
    width:100px;
     @media (max-width: 768px) {
         width:70px;
    }
`
const LoadingTitle = styled.div<{ dark: boolean }>`
    font-size:24px;
    font-weight:bold;
    color:${props => props.dark ? colors.white : colors.black};
    @media (max-width: 768px) {
        font-size:20px;
    }
`
const LoadingDesc = styled.div<{ dark: boolean }>`
    font-size:16px;
    color:${props => props.dark ? "#BFBFBF" : colors.title};
    text-align:center;
    @media (max-width: 768px) {
        font-size:14px;
    }
`
const LoadingTips = styled.div<{ dark: boolean }>`
    font-size:14px;
    color:${props => props.dark ? "#7F7F7F" : colors.title};
    margin-top:20px;
    @media (max-width: 768px) {
        font-size:12px;
    }
`
const LoadingHashView = styled.div<{ dark: boolean }>`
    font-size:14px;
    color:${props => props.dark ? "#7F7F7F" : colors.title};
    margin-top:20px;
    cursor:pointer;
    text-decoration:underline;
     @media (max-width: 768px) {
        font-size:12px;
    }
`
