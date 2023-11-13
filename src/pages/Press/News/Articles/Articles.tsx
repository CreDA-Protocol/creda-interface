import { BgImages } from "@assets/bgImages/bgImages";
import { FontPoppins } from "@components/Row";
import { MainFullBody } from "@pages/AppBody";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { useOpenWarning, useTheme } from "../../../../states/application/hooks";

const Container = styled.div<{ themeDark?: boolean | null }>`
  background: ${({ themeDark }) =>
    themeDark ? "rgb(13, 13, 17)" : "rgb(241, 244, 246)"};
  padding-top: ${isMobile ? "1rem" : "2rem"};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-x: hidden;
`;

const Body = styled.div`
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
  margin: ${isMobile ? "2rem 0" : "2rem auto"};
  max-width: 1140px;
`;

const Section = styled.div`
  flex: 1;
  padding: ${!isMobile && ""};
`;

const Box = styled.div<{ themeDark: boolean | null }>`
  margin: ${isMobile && "1rem"};
  padding: ${isMobile ? "1rem" : "2rem"};
  min-height: 300px;
  background: ${({ themeDark }) => (themeDark ? "rgb(23, 24, 26)" : "white")};

`;

const BoxHeading = styled.div<{ themeDark: boolean | null }>`
  margin-top: 20px;
  color: ${({ themeDark }) => (themeDark ? "rgb(241, 244, 246)" : "#777E90")};
`;

const Card = styled.div<{
  themeDark: boolean | null;
  isHighlight: boolean | null;
}>`
  padding: ${({ isHighlight }) =>
    isHighlight ? "1rem 0rem 0rem" : "3rem 2rem"};
  :not(:last-child) {
    border-bottom: 1px solid
      ${({ themeDark }) => (themeDark ? " #565b73" : "#e8e8e8")};
  }
`;

const CardTitle = styled.label<{
  themeDark: boolean | null;
}>`
  @media (min-width: 768px) and (max-width: 1700px) {
    font-size: 13px;
  }
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: ${isMobile ? "15px" : "15px"};
  color: ${({ themeDark }) => (themeDark ? " #fff" : "#000")} ;
`;

const CardBodyTitle = styled.label<{
  themeDark: boolean | null;
}>`
  font-size: ${isMobile ? "13px" : "13px"};
  color: ${({ themeDark }) => (themeDark ? " #fff" : "#000")} ;
`;

const CardBody = styled.label<{
  themeDark: boolean | null;
}>`
  @media (min-width: 768px) and (max-width: 1700px) {
    font-size: 13px;
  }
  font-size: ${isMobile ? "13px" : "13px"};
  margin: ${isMobile ? "1rem 0" : "1rem auto"};
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
  color: ${({ themeDark }) => (themeDark ? " #f3f6f4" : "#000")} ;
`;

const CardImage = styled.img`
  width: 100%;
  max-height: 100%;
  margin-top: 0.5rem;
  object-fit: cover;
`;

const GradientText = styled.span`
  background: linear-gradient(360deg, #00b8ff 0%, #3466ff 103.91%);
  font-size: ${isMobile ? "20px" : "35px"};
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight: ${isMobile ? "bold" : "bolder"};
  background: -webkit-linear-gradient(0deg, #00b8ff 0%, #3466ff 103.91%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 767px) {
    display: block;
  }
`;

const CitationText = styled.label<{
  themeDark: boolean | null;
}>`
  @media (min-width: 768px) and (max-width: 1700px) {
    font-size: 11px;
  }
  font-size: ${isMobile ? "11px" : "11px"};
  color: ${({ themeDark }) => (themeDark ? " #fff" : "#000")} ;
  display:flex;
  align-items:center;
  justify-content:center;
`;

function Articles(props: any) {
  const hideWarning = useOpenWarning(false);

  useEffect(() => {
    hideWarning();
    document.title = "News & Media";
  }, []);

  return <ArticlesPage props={props} />;
}

const ArticlesPage = ({ props }: any) => {
  const themeDark = useTheme();
  const { t } = useTranslation();
  const location = window.location.pathname

  return (
    <MainFullBody history={props.history}>
      <FontPoppins>
        <Container themeDark={themeDark}>
          <Body>
            <Section style={!isMobile ? { paddingLeft: 0 } : {}}>
              <Box themeDark={themeDark}>
                <CardImage src=
                  {
                    location === `${t("NewDefi")}` ? "https://creda.stablewplite.com/static/media/pexels_olia_clean_low.2214235a.jpg"
                      : location === `${t("CreditScoringProtocol")}` ? `${BgImages.CryptoScoringImage}`
                        : location === `${t("FormerCeo")}` ? `${BgImages.FakhulMiah}`
                          : location === `${t("CyberConnect")}` ? `${BgImages.CyberConnect}`
                            : ''
                  } alt="news-img" />
                <BoxHeading themeDark={themeDark}>
                  <GradientText>
                    {
                      location === `${t("NewDefi")}` ? `${t("NewDeFIPlatform")}`
                        : location === `${t("CreditScoringProtocol")}` ? `${t("CryptoCreditScoringProtocol")}`
                          : location === `${t("FormerCeo")}` ? `${t("CredaCeo")}`
                            : location === `${t("CyberConnect")}` ? `${t("CredaPartners")}`
                              : ''
                    }
                  </GradientText>
                </BoxHeading>
                <Card themeDark={themeDark} isHighlight>
                  <CardTitle themeDark={themeDark}>
                    {
                      location === `${t("NewDefi")}` ? `${t("CredaProtocol")}`
                        : location === `${t("CreditScoringProtocol")}` ? `${t("CredaPlatform")}`
                          : location === `${t("FormerCeo")}` ? `${t("CredaCeoT")}`
                            : location === `${t("CyberConnect")}` ? `${t("CredaConnect")}`
                              : ''
                    }
                  </CardTitle>
                  <CardBody style={{ display: 'block' }} themeDark={themeDark}
                    dangerouslySetInnerHTML=
                    {{
                      __html:
                        location === `${t("NewDefi")}` ? `${t("NewDefiPlatform")}`
                          : location === `${t("CreditScoringProtocol")}` ? `${t("CreditScoringProtocolPartners")}`
                            : location === `${t("FormerCeo")}` ? `${t("FormarCeoStangley")}`
                              : location === `${t("CyberConnect")}` ? `${t("CyberConnectPartner")}`
                                : ''
                    }}
                  >
                  </CardBody>
                  <hr />
                  <div>
                    <CitationText style={{ display: 'block', textAlign: 'center' }} themeDark={themeDark} dangerouslySetInnerHTML=
                      {{
                        __html:
                          location === `${t("NewDefi")}` ? `${t("NewDefiPlatformCitation")}`
                            : location === `${t("CreditScoringProtocol")}` ? `${t("CreditScoringProtocolPartnersCitation")}`
                              : location === `${t("FormerCeo")}` ? `${t("FormarCeoStangleyCitation")}`
                                : location === `${t("CyberConnect")}` ? `${t("CyberConnectPartnerCitation")}`
                                  : ''
                      }}>
                    </CitationText>

                  </div>
                </Card>
              </Box>
            </Section>
          </Body>
        </Container>
      </FontPoppins>
    </MainFullBody>
  );
};

export default withRouter(Articles);
