import { BgImages } from "@assets/bgImages/bgImages";
import { FontPoppins, GradientButton } from "@components/Row";
import { MainFullBody } from "@pages/components/AppBody";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { useOpenWarning, useTheme } from "../../states/application/hooks";
import { news, press } from "./data";

const Container = styled.div<{ themeDark?: boolean | null }>`
  background: ${({ themeDark }) =>
    themeDark ? "rgb(13, 13, 17)" : "rgb(241, 244, 246)"};
  padding-top: ${isMobile ? "3rem" : "8rem"};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
`;

const Heading = styled.span<{ themeDark: boolean | null }>`
  color: ${({ themeDark }) =>
    themeDark ? "rgb(241, 244, 246)" : "rgb(13, 13, 17)"};
  font-size: ${isMobile ? "2rem" : "3rem"};
  margin-top: 25px;
`;

const Description = styled.span`
  color: #565b73;
  font-size: 1rem;
  margin-top: ${isMobile ? "0.5rem" : "1rem"};
  text-align: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
  margin: ${isMobile ? "2rem 0" : "5rem auto"};
  max-width: 1140px;
`;

const Section = styled.div`
  flex: 1;
  padding: ${!isMobile && "2rem"};
`;

const Box = styled.div<{ themeDark: boolean | null }>`
  margin: ${isMobile && "1rem"};
  padding: ${isMobile ? "1rem" : "2rem"};
  min-height: 300px;
  background: ${({ themeDark }) => (themeDark ? "rgb(23, 24, 26)" : "white")};
  border-radius: ${isMobile ? "1rem" : "2rem"};
`;

const BoxHeading = styled.div<{ themeDark: boolean | null }>`
  font-size: ${isMobile ? "1.5rem" : "2rem"};
  color: ${({ themeDark }) => (themeDark ? "rgb(241, 244, 246)" : "#777E90")};
`;

const Card = styled.div<{
  themeDark: boolean | null;
  isHighlight: boolean | null;
}>`
  padding: ${({ isHighlight }) =>
    isHighlight ? "3rem 0rem 0rem" : "3rem 2rem"};
  :not(:last-child) {
    border-bottom: 1px solid
      ${({ themeDark }) => (themeDark ? " #565b73" : "#e8e8e8")};
  }
`;

const CardHeading = styled.div`
  display: flex;
  font-size: 0.8rem;
  align-items: center;
  margin-bottom: 1rem;
  color: #94979b;
`;

const CardTitle = styled.a`
  font-size: ${isMobile ? "1.2rem" : "1.5rem"};
`;

const CardImage = styled.img`
  width: 100%;
  max-height: 320px;
  margin-top: 0.5rem;
  object-fit: cover;
  border-radius: ${isMobile ? "1rem" : "2rem"};
`;

const GradientText = styled.span`
  background: linear-gradient(360deg, #00b8ff 0%, #3466ff 103.91%);
  background: -webkit-linear-gradient(0deg, #00b8ff 0%, #3466ff 103.91%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 767px) {
    display: block;
  }
`;

const FooterContainer = styled.div<{ themeDark: boolean | null }>`
  width: ${isMobile ? "100vw" : "calc(100vw - 17px)"};
  background: ${({ themeDark }) => (themeDark ? "rgb(23, 24, 26)" : "white")};
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ themeDark }) =>
    themeDark ? "rgb(241, 244, 246)" : "rgb(13, 13, 17)"};
  padding-bottom: ${isMobile ? "2rem" : "3rem"};
`;

const Inquire = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: ${isMobile ? "1rem 0" : "2rem 0"};
`;

const InquireText = styled.span<{ themeDark: boolean | null }>`
  font-size: 2rem;
  text-align: center;
  word-wrap: break-word;
`;

const Button = styled(GradientButton)`
  margin-top: 1rem;
  height: 3rem;
  font-size: 1rem;
`;

const Video = styled.iframe`
  width: 100%;
  height: 240px;
`;

const Media = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${isMobile ? "0" : "3rem"};
  flex-direction: ${isMobile ? "column" : "row"};
  margin: ${isMobile ? "auto" : " auto"};
  max-width: 1140px;
  padding: ${!isMobile && "0 2rem"};
`;

const MediaCard = styled.div<{ themeDark: boolean | null }>`
  background: ${({ themeDark }) =>
    themeDark ? "rgb(13, 13, 17)" : "rgb(241, 244, 246)"};
  border-radius: ${isMobile ? "1rem" : "1rem"};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: ${isMobile && "0 1rem"};
  :not(:last-child) {
    margin-bottom: ${isMobile && "1rem"};
    margin-right: ${!isMobile && "2rem"};
  }
`;

const MediaImg = styled.img`
  width: 100%;
  height: 204px;
  object-fit: cover;
`;

const MediaBody = styled.div`
  padding: 4px 0px 10px 0px;
`;

const MediaLink = styled.a`
  font-size: 1rem;
`;

const MediaTitle = styled.div`
  width: 100%;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center
`;

function Press(props: any) {
  const hideWarning = useOpenWarning(false);

  useEffect(() => {
    hideWarning();
    document.title = "News & Media";
  }, []);

  return <PressPage props={props} />;
}

const PressPage = ({ props }: any) => {
  const themeDark = useTheme();
  const { t } = useTranslation();

  return (
    <MainFullBody history={props.history}>
      <FontPoppins>
        <Container themeDark={themeDark}>
          <Heading themeDark={themeDark}>
            <GradientText>{t("News&Media")}</GradientText>
          </Heading>
          {/* <Description>{t("MediaDesc")}</Description> */}
          <Body>
            <Section style={!isMobile ? { paddingLeft: 0 } : {}}>
              <Box themeDark={themeDark}>
                <BoxHeading themeDark={themeDark}>
                  <GradientText>{t("MediaCoverage")}</GradientText>
                </BoxHeading>
                {news[0].name === 'media' ?
                  <Card themeDark={themeDark} isHighlight>
                    <CardHeading>
                      {`${news[0].publisher} - ${news[0].published}`}
                    </CardHeading>
                    <CardTitle href={news[0].url} target={"_blank"}>
                      {news[0].title}
                    </CardTitle>
                    <br />
                    <CardHeading>{news[0].desc}</CardHeading>
                    {news[0].picture && (
                      <CardImage src={news[0].picture} alt="news-img" />
                    )}
                  </Card> :
                  <Card key={news[0].url} themeDark={themeDark} isHighlight={false}>
                    <CardHeading>
                      {`Influencer - ${news[0].name}`} - {news[0].published}
                    </CardHeading>
                    <Video src={news[0].url} frameBorder={0} allowFullScreen />
                  </Card>
                }
              </Box>
              {news.slice(1).map((item) => (
                <Card key={item._id} themeDark={themeDark} isHighlight={false}>
                  <CardHeading>
                    {`${item.publisher} - ${item.published}`}
                  </CardHeading>
                  {item.name === 'media' ?
                    <CardTitle href={item.url} target={"_blank"}>
                      {item.title}
                    </CardTitle>
                    :
                    <Video src={item.url} frameBorder={0} allowFullScreen />
                  }
                </Card>
              ))}
              {/* {influencers.map((item) => (
                <Card key={item.url} themeDark={themeDark} isHighlight={false}>
                  <CardHeading>
                    {`${t("Influencer")} - ${item.name}`} - {item.published}
                  </CardHeading>
                  <Video src={item.url} frameBorder={0} allowFullScreen />
                </Card>
              ))} */}
            </Section>
            <Section style={!isMobile ? { paddingRight: 0 } : {}}>
              <Box themeDark={themeDark}>
                <BoxHeading themeDark={themeDark}>
                  <GradientText>{t("NewsandAnnouncements")}</GradientText>
                </BoxHeading>
                <Card themeDark={themeDark} isHighlight>
                  <CardHeading>
                    {`${press[0].publisher} - ${press[0].published}`}
                  </CardHeading>
                  <CardTitle href="creda-partners-with-cyberconnect-to-include-social-data-in-crypto-credit-scores" target={"_blank"}>{t(press[0].title)}</CardTitle>
                  <CardHeading>{press[0].desc}</CardHeading>
                  {press[0].picture && (
                    <CardImage src={BgImages.CredaCyberConnect} alt="news-img" />
                  )}
                </Card>
              </Box>
              {press.slice(1).map((item) => (
                <Card key={item._id} themeDark={themeDark} isHighlight={false}>
                  <CardHeading>
                    {`${item.publisher} - ${item.published}`}
                  </CardHeading>
                  <CardTitle href={item.url} target={"_blank"}>{item.title}</CardTitle>
                </Card>
              ))}
            </Section>
          </Body>
        </Container>
        <FooterContainer themeDark={themeDark}>
          <Heading themeDark={themeDark}>
            <GradientText>{t("Resources")}</GradientText>
          </Heading>
          <Media>
            <MediaBody>
              <MediaTitle>
                <CardTitle target="_blank" href="https://creda-app.gitbook.io/news-and-media-resources/news-and-media-resources/logo-and-brand-guide">Our Logo</CardTitle>
              </MediaTitle>
              <MediaTitle>
                <CardTitle target="_blank" href="https://creda-app.gitbook.io/news-and-media-resources/news-and-media-resources/press-kit">Media Kit</CardTitle>
              </MediaTitle>
            </MediaBody>
          </Media>
          <Inquire>
            <InquireText themeDark={themeDark}>{t("Inquire")}</InquireText>
            <a href="mailto:press@creda.app">
              <Button>press@creda.app</Button>
            </a>
          </Inquire>
        </FooterContainer>
      </FontPoppins>
    </MainFullBody>
  );
};

export default Press;
