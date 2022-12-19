import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";
import { DependenciesTable } from "shared/components";
import { ApplicationDto } from "api/application";

export const ApplicationDependencies: React.FC = () => {
  const application = useOutletContext<ApplicationDto | null>();

  return (
    <PageSection>
      <DependenciesTable applicationId={application?.id} />
    </PageSection>
  );
};
