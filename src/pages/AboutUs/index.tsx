import { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import styled from "styled-components";
import { FontPoppins } from "../../components/Row";
import { useOpenWarnning, useTheme } from "../../state/application/hooks";
import { MainFullBody } from "../AppBody";
import {
  benjaminPiette,
  cassieZhang,
  fakhulMiah,
  jamieRead,
  kevinWong,
  longWang,
  nenadDukelic,
  sakuraMoriuchi,
  songBao,
  sunnyFengHan,
  troyTohid,
  williamZhijunZhang,
  fred,
  creda_logo,
  small_logo,
  John
} from "../../assets/aboutUs";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal";

const GradientText = styled.span`
  background: linear-gradient(360deg, #00b8ff 0%, #3466ff 103.91%);
  background: -webkit-linear-gradient(0deg, #00b8ff 0%, #3466ff 103.91%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 767px) {
    display: block;
  }
`;

const Title = styled.span`
  font-size: ${isMobile ? "2rem" : "3rem"};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${isMobile ? "2rem 0" : "5rem auto"};
  width: ${isMobile && "100vw"};
  padding: ${isMobile && "0 1rem"};
  max-width: 1140px;
`;

const Description = styled.p<{ themeDark: boolean | null }>`
  font-size: ${isMobile ? "1rem" : "1.2rem"};
  margin-top: ${isMobile ? "0.5rem" : "1rem"};
  text-align: center;
  width: ${isMobile ? "100%" : "80%"};
  color: ${({ themeDark }) => (themeDark ? "#eeeeee" : "#565b73")};
`;

const TeamBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: ${isMobile ? "column" : "row"};
`;

interface AboutUsProps {
  history: any;
}

const AboutUs: FunctionComponent<AboutUsProps> = (props) => {
  const hideWarning = useOpenWarnning(false);

  useEffect(() => {
    hideWarning();
    document.title = "About Us";
  }, [hideWarning]);

  return (
    <MainFullBody history={props.history}>
      <FontPoppins>
        <AboutUsBody />
      </FontPoppins>
    </MainFullBody>
  );
};

const AboutUsBody: FunctionComponent = () => {
  const { t } = useTranslation();

  const themeDark = useTheme();

  return (
    <Body>
      <Title>
        <GradientText>{t("AboutUs")}</GradientText>
      </Title>
      <Description
        themeDark={themeDark}
        dangerouslySetInnerHTML={{ __html: t("AboutUsDesc") }}
      />
      <Title style={{ marginTop: isMobile ? "1rem" : "4rem" }}>
        <GradientText>{t("OurTeam")}</GradientText>
      </Title>
      <Description themeDark={themeDark}>{t("OurTeamDesc")}</Description>
      <GradientText style={{ fontSize: "1.25rem", margin: "1rem" }}>
        {t("LeaderShipTeam")}
      </GradientText>
      <TeamBody>
        <AboutUsCard
          img={fakhulMiah}
          name="Fakhul Miah"
          title={t("TeamLeadBoardExecutive")}
          bio={t("FakhulMiahBio")}
          location="Europe"
        />
        <AboutUsCard
          img={kevinWong}
          name="Kevin Wong"
          title={t("ChiefTechnologyOfficer")}
          bio={t("KevinWongBio")}
          location="Asia"
        />
        <AboutUsCard
          img={cassieZhang}
          name="Cassie Zhang"
          title={t("ChiefOperatingOfficer")}
          bio={t("CassieZhangBio")}
          location="North America"
        />
        <AboutUsCard
          img={jamieRead}
          name="Jamie Read"
          title={t("ChiefMarketingOfficer")}
          bio={t("JamieReadBio")}
          location="North America"
        />
        <AboutUsCard
          img={fred}
          name="Fred Diniz"
          title={t("HeadofCRM")}
          bio={t("FredDinizBio")}
          location="Europe"
        />
        <AboutUsCard
          img={nenadDukelic}
          name="Nenad Dukelic"
          title={t("CommunityManager")}
          bio={t("NenadDukelicBio")}
          location="Europe"
        />
        <AboutUsCard
          img={John}
          name="Jonathan Hargreaves"
          title={t("ESGOfficer")}
          bio={t("JonhathanBio")}
          location="Europe"
        />
        <AboutUsCard
          img={small_logo}
          name="David Wu"
          title={t("CreditOracleLead")}
          bio={t("DavidBio")}
          location="Asia"
        />
      </TeamBody>
      <GradientText
        style={{
          fontSize: "1.25rem",
          margin: "1rem",
          marginTop: isMobile ? "1rem" : "3rem",
        }}
      >
        {t("AdvisoryTeam")}
      </GradientText>
      <TeamBody>
      <AboutUsCard
          img={longWang}
          name="Long Wang"
          title={t("ExecutiveAdvisor")}
          bio={t("LongWangBio")}
          location="North America"
        />
        <AboutUsCard
          img={troyTohid}
          name="Troy Tohid"
          title={t("ExecutiveBoardAdvisor")}
          bio={t("TroyTohidBio")}
          location="Europe"
        />
        <AboutUsCard
          img={sunnyFengHan}
          name="Sunny Feng Han"
          title={t("ExecutiveBoardAdvisor")}
          bio={t("SunnyFengHanBio")}
          location="Asia"
        />
        <AboutUsCard
          img={small_logo}
          name="Sean Liu"
          title={t("SWEngineerConsultant")}
          bio={t("SeanBio")}
          location="North America"
        />
        <AboutUsCard
          img={benjaminPiette}
          name="Benjamin Piette"
          title={t("TechnicalAdvisor")}
          bio={t("BenjaminPietteBio")}
          location="Asia"
        />
        <AboutUsCard
          img={sakuraMoriuchi}
          name="Sakura Moriuchi"
          title={t("BusinessDevelopmentAdvisor")}
          bio={t("SakuraMoriuchiBio")}
          location="North America"
        />
        <AboutUsCard
          img={songBao}
          name="Song Bao"
          title={t("DigitalAssetsAdvisor")}
          bio={t("SoongBaoBio")}
          location="Asia"
        />
        <AboutUsCard
          img={williamZhijunZhang}
          name="Dr. William Zhang"
          title={t("Risk&ComplianceAdvisor")}
          bio={t("WilliamZhangBio")}
          location="North America"
        />
      </TeamBody>
    </Body>
  );
};

export default AboutUs;

const Avatar = styled.img<{name: string | null}>`
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  transition: height 0.3s ease, width 0.3s ease;
  width: ${({ name }) =>
  name=='Jonathan Hargreaves' ? "5rem" : "4rem"};
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.5rem;
`;

const JobTitle = styled.span<{ themeDark: boolean | null }>`
  font-size: 0.75rem;
  color: ${({ themeDark }) =>
    themeDark ? "rgb(241, 244, 246)" : "rgb(13, 13, 17)"};
  transition: color 0.3s ease;
`;

const Name = styled.span<{ themeDark: boolean | null }>`
  font-weight: bold;
`;

const Card = styled.div<{
  themeDark: boolean | null;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  cursor: pointer;
  height: 5rem;
  padding: 10px;
  border-radius: 2.5rem;
  transition: background-color 0.3s ease;
  background-color: ${({ themeDark }) =>
    themeDark ? "rgb(23, 24, 26)" : "white"};
  width: ${isMobile ? "100%" : "30%"};
  margin-bottom: ${isMobile ? "1rem" : "2rem"};
  :not(:nth-child(3n)) {
    margin-right: ${isMobile ? "0" : "5%"};
  }
`;

const CardBody = styled.div`
  display: flex;
  align-items: center !important;
  justify-content: center;
`;

const ModalBody = styled.div<{ themeDark: boolean | null }>`
  background-color: ${({ themeDark }) =>
    themeDark ? "rgb(23, 24, 26)" : "white"};
  max-width: 1140px;
  width: 100%;
  padding: 1rem;
  position: relative;
`;

const ModalTitle = styled(GradientText)`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ModalJobTitle = styled.span<{ themeDark: boolean | null }>`
  font-weight: bold;
  color: ${({ themeDark }) =>
    themeDark ? "rgb(241, 244, 246)" : "rgb(13, 13, 17)"};
  font-size: 1rem;
`;

const ModalDesc = styled.div<{ themeDark: boolean | null }>`
  color: ${({ themeDark }) =>
    themeDark ? "rgb(241, 244, 246)" : "rgb(13, 13, 17)"};
  margin: 0.5rem 0;
  height: calc(100% - 134px);
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ModalImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
`;

const Arrow = styled.div<{ themeDark: boolean | null }>`
  display: flex;
  align-items: center;
  svg {
    height: 1.5rem;
    fill: ${({ themeDark }) =>
      themeDark ? "rgb(241, 244, 246)" : "rgb(13, 13, 17)"};
  }
`;

const ModalHeader = styled.div<{ themeDark: boolean | null }>`
  display: flex;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: solid 1px
    ${({ themeDark }) => (themeDark ? "#565b73" : "#eeeeee")};
  margin-bottom: 1rem;
`;

const ModalClose = styled.div<{ themeDark: boolean | null }>`
  display: flex;
  align-items: center;
  position: absolute;
  right: 1rem;
  top: 1rem;
  cursor: pointer;
  svg {
    height: 1.5rem;
    fill: ${({ themeDark }) =>
      themeDark ? "rgb(241, 244, 246)" : "rgb(13, 13, 17)"};
  }
`;

interface CardProps {
  img: string;
  name: string;
  title: string;
  location?:
    | "North America"
    | "Europe"
    | "Asia"
    | "Africa"
    | "South America"
    | "Australia";
  bio?: string;
  style?: CSSProperties;
}

const AboutUsCard: FunctionComponent<CardProps> = ({
  img,
  name,
  title,
  location = "North America",
  bio = "",
  style = {},
}) => {
  const themeDark = useTheme();
  console.log("_name",name)
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <Card onClick={onOpen} themeDark={themeDark} style={{ ...style }}>
        <CardBody>
          <Avatar name={name} src={img} />
          <Details>
            <GradientText>
              <Name themeDark={themeDark}>{name}</Name>
            </GradientText>
            <JobTitle themeDark={themeDark}>{title}</JobTitle>
            <JobTitle themeDark={themeDark}>{location}</JobTitle>
          </Details>
        </CardBody>
        <Arrow themeDark={themeDark}>
          <svg
            className="bi bi-chevron-right"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </Arrow>
      </Card>
      <Modal isOpen={isOpen} onDismiss={onClose}>
        <ModalBody themeDark={themeDark}>
          <ModalClose themeDark={themeDark} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z" />
            </svg>
          </ModalClose>
          <ModalHeader themeDark={themeDark}>
            <ModalImg src={img} />
            <div
              style={{
                marginLeft: "1rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <ModalTitle>{name}</ModalTitle>
              <ModalJobTitle themeDark={themeDark}>{title}</ModalJobTitle>
              {/* <ModalJobTitle themeDark={themeDark} style={{ color: "#565b73" }}>
                {location}
              </ModalJobTitle> */}
            </div>
          </ModalHeader>
          <ModalDesc
            themeDark={themeDark}
            dangerouslySetInnerHTML={{ __html: bio }}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
