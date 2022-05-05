import React from "react";
import { PageHeader, Brand, PageHeaderTools } from "@patternfly/react-core";

import navBrandImage from "images/navbar.svg";

export const HeaderApp: React.FC = () => {
  return (
    <PageHeader
      logo={<Brand src={navBrandImage} alt="Brand"></Brand>}
      logoProps={{
        href: "https://patternfly.org",
        onClick: () => console.log("clicked logo"),
        target: "_blank",
      }}
      headerTools={<PageHeaderTools>header-tools</PageHeaderTools>}
      showNavToggle
    />
  );
};
