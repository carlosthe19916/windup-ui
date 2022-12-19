import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  PageSection,
} from "@patternfly/react-core";

import { JavaIncidentsByPackage } from "shared/components";

import { Application } from "api/models";
import { MessagesCard } from "./components/messages-card";
import { ApplicationFilesTable } from "./components/application-files-table";
import { TagsChart } from "./components/tags-chart";
import { useApplicationsDetailsQuery } from "queries/applications-details";

export const ApplicationDetails: React.FC = () => {
  const application = useOutletContext<Application | null>();

  const applicationsDetailsQuery = useApplicationsDetailsQuery();
  const applicationFiles = useMemo(() => {
    return (
      applicationsDetailsQuery.data?.find(
        (f) => f.applicationId === application?.id
      )?.applicationFiles || []
    );
  }, [applicationsDetailsQuery.data, application]);

  return (
    <>
      <PageSection>
        <Grid hasGutter md={6}>
          <GridItem>
            <Card isFullHeight>
              <CardTitle>Tags found - Occurrence found</CardTitle>
              <CardBody>
                <TagsChart applicationFile={applicationFiles} />
              </CardBody>
            </Card>
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
