import React from "react";
import { useOutletContext } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";
import { IssuesTable } from "shared/components";
import { Application } from "api/models";

export const ApplicationIssues: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <PageSection>
      <IssuesTable applicationId={application?.id} />
    </PageSection>
  );
};
