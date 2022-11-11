import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";
import { DependenciesTable } from "shared/components";
import { Application } from "api/models";

export const ApplicationDependencies: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <PageSection>
      <DependenciesTable applicationId={application?.id} />
    </PageSection>
  );
};
