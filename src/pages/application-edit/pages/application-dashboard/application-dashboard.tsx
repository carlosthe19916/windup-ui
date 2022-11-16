import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection, Stack, StackItem } from "@patternfly/react-core";

import { Application } from "api/models";
import { IncidentsSection } from "./components/incidents-section";
import { EffortsSection } from "./components/efforts-section";
import { PackagesSection } from "./components/packages-section";

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
            {application && <PackagesSection application={application} />}
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};
