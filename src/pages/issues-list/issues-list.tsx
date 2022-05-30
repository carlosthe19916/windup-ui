import React from "react";
import { useNavigate, useParams } from "react-router-dom";

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

import { useApplicationsQuery } from "queries/applications";
import { SimpleContextSelector, Context } from "context/simple-context";
import { ApplicationRoute } from "Routes";

export const IssuesList: React.FC = () => {
  const params = useParams<ApplicationRoute>();
  const navigate = useNavigate();

  const applications = useApplicationsQuery();

  const onContextChange = (context: Context) => {
    navigate("/issues/applications/" + context.key);
  };

  return (
    <>
      <PageSection padding={{ default: "noPadding" }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>Application:</ToolbarItem>
            <ToolbarItem>
              <SimpleContextSelector
                contextKeyFromURL={params.applicationId}
                allContexts={(applications.data || []).map((e) => ({
                  key: `${e.id}`,
                  label: e.name,
                }))}
                onChange={onContextChange}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <Divider />
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Issues</Text>
          <Text component="small">
            This report provides a concise summary of all issues identified.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>hello</PageSection>
    </>
  );
};
