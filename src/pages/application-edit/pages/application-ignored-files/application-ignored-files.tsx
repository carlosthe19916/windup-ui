import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";
import { IgnoredFilesTable } from "shared/components";
import { ApplicationDto } from "api/application";

export const ApplicationIgnoredFiles: React.FC = () => {
  const application = useOutletContext<ApplicationDto | null>();

  return (
    <PageSection>
      <IgnoredFilesTable applicationId={application?.id} />
    </PageSection>
  );
};
