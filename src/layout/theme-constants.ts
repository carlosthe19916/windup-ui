import windupLogo from "images/windup-logo.svg";
import windupNavBrandImage from "images/windup-logo-header.svg";

import mtaLogo from "images/mta-logo.svg";
import mtaNavBrandImage from "images/mta-logo-header.svg";

import tackleLogo from "images/tackle-logo.png";
import tackleNavBrandImage from "images/tackle-logo-header.svg";
import tackleFavicon from "images/tackle-favicon.png";

type ThemeType = "windup" | "mta" | "tackle";
const defaultTheme: ThemeType = "windup";

type ThemeListType = {
  [key in ThemeType]: {
    name: string;
    logoSrc: string;
    logoNavbarSrc: string;
    faviconSrc?: string;
  };
};

const themeList: ThemeListType = {
  windup: {
    name: "Windup",
    logoSrc: windupLogo,
    logoNavbarSrc: windupNavBrandImage,
  },
  mta: {
    name: "Migration Toolkit for Applications",
    logoSrc: mtaLogo,
    logoNavbarSrc: mtaNavBrandImage,
  },
  tackle: {
    name: "Tackle Analysis",
    logoSrc: tackleLogo,
    logoNavbarSrc: tackleNavBrandImage,
    faviconSrc: tackleFavicon,
  },
};

export const Theme =
  themeList[(process.env.REACT_APP_THEME as ThemeType) || defaultTheme];
