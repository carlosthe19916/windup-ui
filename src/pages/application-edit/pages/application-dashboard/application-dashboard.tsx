import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection, Stack, StackItem } from "@patternfly/react-core";

import { JavaIncidentsByPackage } from "shared/components";

import { Application } from "api/models";
import { IncidentsSection } from "./components/incidents-section";
import { EffortsSection } from "./components/efforts-section";

export const ApplicationDashboard: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <>
      <PageSection>
        <Stack hasGutter>
          <StackItem>
            {application && <IncidentsSection application={application} />}
          </StackItem>
          <StackItem>
            {application && <EffortsSection application={application} />}
          </StackItem>
          <StackItem>
            {application && <JavaIncidentsByPackage application={application} />}
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};
