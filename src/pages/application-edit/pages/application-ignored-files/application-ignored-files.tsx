import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";
import { IgnoredFilesTable } from "shared/components";
import { Application } from "api/models";

export const ApplicationIgnoredFiles: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <PageSection>
      <IgnoredFilesTable applicationId={application?.id} />
    </PageSection>
  );
};
