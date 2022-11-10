import React from "react";
import { NavLink } from "react-router-dom";

import { Nav, PageSidebar, NavList } from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";

import { LayoutTheme } from "./layout-constants";
import { useSimpleContext } from "context/simple-context";

export const SidebarApp: React.FC = () => {
  const { currentContext } = useSimpleContext();

  const renderPageNav = () => {
    return (
      <Nav id="nav-sidebar" aria-label="Nav" theme={LayoutTheme}>
        <NavList>
          <NavLink
            to="/"
            className={({ isActive }) =>
              css("pf-c-nav__link", isActive ? "pf-m-current" : "")
            }
          >
            Applications
          </NavLink>
        </NavList>
        <NavList>
          <NavLink
            to={
              !currentContext
                ? "/issues"
                : "/issues/applications/" + currentContext.key
            }
            className={({ isActive }) =>
              css("pf-c-nav__link", isActive ? "pf-m-current" : "")
            }
          >
            Issues
          </NavLink>
        </NavList>
        <NavList>
          <NavLink
            to={
              !currentContext
                ? "/technologies"
                : "/technologies/applications/" + currentContext.key
            }
            className={({ isActive }) =>
              css("pf-c-nav__link", isActive ? "pf-m-current" : "")
            }
          >
            Technologies
          </NavLink>
        </NavList>
        <NavList>
          <NavLink
            to={
              !currentContext
                ? "/dependencies"
                : "/dependencies/applications/" + currentContext.key
            }
            className={({ isActive }) =>
              css("pf-c-nav__link", isActive ? "pf-m-current" : "")
            }
          >
            Dependencies
          </NavLink>
        </NavList>
      </Nav>
    );
  };

  return <PageSidebar nav={renderPageNav()} theme={LayoutTheme} />;
};
