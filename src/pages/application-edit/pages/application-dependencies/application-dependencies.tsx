import React from "react";
import { useOutletContext } from "react-router-dom";
import { DependenciesTable } from "shared/components";
import { Application } from "api/models";

export const ApplicationDependencies: React.FC = () => {
  const application = useOutletContext<Application | null>();

  return (
    <>
      <DependenciesTable applicationId={application?.id} />
    </>
  );
};
