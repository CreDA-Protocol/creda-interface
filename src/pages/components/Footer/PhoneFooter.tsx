import ImageCommon from "@assets/common/ImageCommon";
import { Column } from "@components/Column";
import { ButtonClick, CustomGrid, RowFixed, SpaceHeight, SpaceWidth, Text, WrapMaxWidth } from "@components/Row";
import { ThemeText } from "@components/ThemeComponent";
import { useTranslation } from "react-i18next";
import { useTheme } from "src/state/application/hooks";
import { BottomDiscordIcon, BottomDown, BottomFooterWrap, BottomIcon, BottomInfoDiv, BottomMediumIcon, BottomRedditIcon, FooterLink, FooterLinkWrap } from "./FooterStyles";

export function PhoneFooter() {
  const { t } = useTranslation();
  const themeDark = useTheme();

  return (
    <BottomInfoDiv
      style={{
        backgroundColor: themeDark ? "#0D0D11" : "#F1F4F6",
      }}
    >
      <WrapMaxWidth style={{ width: "100%" }}>
        <FooterLinkWrap>
          <CustomGrid
            templateColumns={"repeat(3, 1fr)"}
            mobTemplateColumns={"1fr 1fr"}
            style={{ alignItems: "baseline", padding: "0 30px" }}
          >
            <div>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={28}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Resources")}
                </Text>
                <Column style={{ paddingTop: "5px" }}>
                  {/*<RowFixed style={{cursor:'pointer'}} onClick={()=>{
                // window.open('https://github.com/CreDA-Protocol')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Media')}</ThemeText>
                </FooterLink>
              </RowFixed>*/}
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "https://creda-app.gitbook.io/protocol/introduction/creda-protocol-whitepaper"
                      );
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("WhitePaper")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "https://creda-app.gitbook.io/protocol/guides/arbitrum-guide"
                      );
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Walkthrough")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>

                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = "/news-and-media";
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("News&Media")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open("/press");
                      window.location.href = "/about-us";
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("About Us")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>

                  {/* <RowFixed style={{cursor:'pointer'}} onClick={()=>{
                window.open('https://www.reddit.com/r/CreDAOfficial/')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Reddit')}</ThemeText>
                </FooterLink>
              </RowFixed> */}
                  {/*<RowFixed style={{cursor:'pointer'}} onClick={()=>{
                // window.open('')
              }}>
                <FooterLink>
                  <ThemeText fontSize={28} fontWeight={800}>{t('Team')}</ThemeText>
                </FooterLink>
              </RowFixed>*/}
                  <SpaceHeight height={20} heightApp={10} />
                </Column>
              </span>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={28}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Development")}
                </Text>
                <Column style={{ paddingTop: "5px" }}>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://creda-app.gitbook.io/creda-protocol/");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Gitbook")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open('')
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("API")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://github.com/CreDA-Protocol");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Github")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                </Column>
              </span>
            </div>
            <div>
              <span>
                <Text
                  className="ft_hd"
                  fontSize={28}
                  fontColor={"#3278FF"}
                  fontWeight={"800"}
                >
                  {t("Community")}
                </Text>
                <Column style={{ paddingTop: "5px" }}>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://t.me/CreDAOfficial");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Telegram")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://twitter.com/CreDAfinance");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Twitter")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://discord.com/invite/eSvTm6a6kb");
                      // window.open('https://discord.gg/eSvTm6a6kb')
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Discord")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://www.reddit.com/r/CreDAOfficial/");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Reddit")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                  <RowFixed
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open("https://medium.com/@creda-app");
                    }}
                  >
                    <FooterLink>
                      <ThemeText fontSize={28} fontWeight={800}>
                        {t("Medium")}
                      </ThemeText>
                    </FooterLink>
                  </RowFixed>
                </Column>
              </span>
            </div>
          </CustomGrid>
          <SpaceHeight height={20} heightApp={20} />
        </FooterLinkWrap>
      </WrapMaxWidth>
      <BottomFooterWrap>
        <BottomDown style={{ flexWrap: "wrap" }}>
          <RowFixed style={{ flex: "0 0 100%", justifyContent: "center" }}>
            <ButtonClick
              onClick={() => {
                window.open("https://twitter.com/CreDAfinance");
              }}
            >
              <BottomIcon src={ImageCommon.TwitterIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://github.com/CreDA-Protocol");
              }}
            >
              <BottomIcon src={ImageCommon.GithubIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://t.me/CreDAOfficial");
              }}
            >
              <BottomIcon src={ImageCommon.TelegramIcon} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://www.reddit.com/r/CreDAOfficial/");
              }}
            >
              <BottomRedditIcon src={ImageCommon.Reddit_new} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                window.open("https://discord.com/invite/eSvTm6a6kb");
                // window.open('https://discord.gg/eSvTm6a6kb')
              }}
            >
              <BottomDiscordIcon src={ImageCommon.Discord_new} />
            </ButtonClick>
            <SpaceWidth width={60} widthApp={30} />
            <ButtonClick
              onClick={() => {
                // window.open('https://discord.gg/eSvTm6a6kb')
                window.open("https://medium.com/@creda-app");
              }}
            >
              <BottomMediumIcon src={ImageCommon.MediumIcon} />
            </ButtonClick>
          </RowFixed>
          <Text
            style={{ flex: "0 0 100%", textAlign: "center" }}
            fontSize={21}
            fontColor={"#0ECFF2"}
            fontWeight={"800"}
          >
            {t("CopyrightOnly")} {t("AllRightsReserved")}
          </Text>
        </BottomDown>
      </BottomFooterWrap>
    </BottomInfoDiv>
  );
}