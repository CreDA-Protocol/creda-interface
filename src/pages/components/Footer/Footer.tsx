import { isMobile } from "react-device-detect";
import { DesktopFooter } from "./DesktopFooter";
import { PhoneFooter } from "./PhoneFooter";

export function Footer() {
  return <>{isMobile ? <PhoneFooter /> : <DesktopFooter />}</>;
}