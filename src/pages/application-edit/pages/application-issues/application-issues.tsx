import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";
import { IssuesTable } from "shared/components";
import { ApplicationDto } from "api/application";

export const ApplicationIssues: React.FC = () => {
  const application = useOutletContext<ApplicationDto | null>();

  return (
    <PageSection>
      <IssuesTable applicationId={application?.id} />
    </PageSection>
  );
};
