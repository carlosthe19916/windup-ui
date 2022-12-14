import React from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Grid, GridItem, PageSection } from "@patternfly/react-core";

import { JavaIncidentsByPackage } from "shared/components";

import { Application } from "api/models";
import { MessagesCard } from "./components/messages-card";
import { ApplicationFilesTable } from "./components/application-files-table";

export const ApplicationDetails: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <>
      <PageSection>
        <Grid hasGutter md={6}>
          <GridItem>
            <Card>tags</Card>
          </GridItem>
          <GridItem>
            {application && <MessagesCard application={application} />}
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection>
        {application && <JavaIncidentsByPackage application={application} />}
      </PageSection>
      <PageSection>
        {application && <ApplicationFilesTable application={application} />}
      </PageSection>
    </>
  );
};
