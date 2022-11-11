import React from "react";
import { useOutletContext } from "react-router-dom";
import { IssuesTable } from "shared/components";
import { Application } from "api/models";

export const ApplicationIssues: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <>
      <IssuesTable applicationId={application?.id} />
    </>
  );
};
