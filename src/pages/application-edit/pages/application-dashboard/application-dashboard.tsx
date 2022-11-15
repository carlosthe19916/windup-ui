import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";

import { Application } from "api/models";
import { IncidentsSection } from "./components/incidents-section";

export const ApplicationDashboard: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <>
      <PageSection>
        {application && <IncidentsSection application={application} />}
      </PageSection>
    </>
  );
};
