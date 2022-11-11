import React from "react";
import { useNavigate, useMatch } from "react-router-dom";

import {
  Divider,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import { SimpleContextSelector, Context } from "context/simple-context";
import { DependenciesTable } from "shared/components";

export const DependenciesList: React.FC = () => {
  const matchDependenciesPage = useMatch("/dependencies");
  const matchAllDependenciesPage = useMatch("/dependencies/applications");
  const matchSingleApplicationPage = useMatch(
    "/dependencies/applications/:applicationId"
  );

  const applicationId = matchDependenciesPage
    ? undefined
    : matchAllDependenciesPage
    ? ""
    : matchSingleApplicationPage?.params.applicationId;

  const navigate = useNavigate();

  const onContextChange = (context: Context) => {
    navigate("/dependencies/applications/" + context.key);
  };

  return (
    <>
      <PageSection padding={{ default: "noPadding" }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>Application:</ToolbarItem>
            <ToolbarItem>
              <SimpleContextSelector
                contextKeyFromURL={applicationId}
                onChange={onContextChange}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <Divider />
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Dependencies</Text>
          <Text component="small">
            This report lists all found Java libraries embedded within the
            analyzed application.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <DependenciesTable applicationId={applicationId} />
      </PageSection>
    </>
  );
};
