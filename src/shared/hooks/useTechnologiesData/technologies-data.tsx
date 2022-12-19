import { useCallback, useMemo } from "react";

import { ToolbarChip } from "@patternfly/react-core";
import { OptionWithValue } from "@project-openubl/lib-ui";

import { useTechnologiesQuery } from "queries/technologies";
import { useApplicationsQuery } from "queries/applications";

import { ALL_TECHNOLOGY_GROUPS, Application } from "api/models";
import { TechnologyGroupsProcessed } from "api/processed-models";

interface RowData {
  application: Application;
  technologyGroups: TechnologyGroupsProcessed;
}

export interface ITechnologiesProps {
  applicationId?: string;
  hideEmptyCategoryOptions?: boolean;
}

export const useTechnologiesData = ({
  applicationId,
  hideEmptyCategoryOptions,
}: ITechnologiesProps) => {
  // Queries
  const allApplications = useApplicationsQuery();
  const allTechnologies = useTechnologiesQuery();

  const applications = useMemo(() => {
    const toRowData = (appsToMap: Application[]) => {
      return appsToMap.reduce((prev, current) => {
        const applicationTechnologies = allTechnologies.data?.find(
          (appTech) => appTech.applicationId === current.id
        );

        if (applicationTechnologies) {
          const rowData: RowData = {
            application: current,
            technologyGroups: applicationTechnologies.technologyGroups,
          };
          return [...prev, rowData];
        } else {
          return prev;
        }
      }, [] as RowData[]);
    };

    if (applicationId === "") {
      return toRowData(allApplications.data || []);
    } else {
      const selectedApplication = allApplications.data?.find(
        (f) => f.id === applicationId
      );

      return toRowData(selectedApplication ? [selectedApplication] : []);
    }
  }, [allApplications.data, allTechnologies.data, applicationId]);

  // Category Select filter
  const toOption = useCallback((option: ToolbarChip): OptionWithValue => {
    const toStringFn = () => option.node as string;
    return {
      value: option.key,
      toString: toStringFn,
      compareTo: (other: string | OptionWithValue) => {
        return typeof other === "string"
          ? toStringFn().toLowerCase().includes(other.toLowerCase())
          : option.key === other.value;
      },
    };
  }, []);

  const allCategoryOptions = useMemo(() => {
    if (applications.length > 0) {
      return ALL_TECHNOLOGY_GROUPS.reduce((prev, currentGroup) => {
        const technologies = applications[0].technologyGroups[currentGroup];
        const numberOfTechnologies = Object.keys(technologies).length;

        const sumOfTechnologiesTotal = Object.entries(technologies)
          .map(([technologyName, { total }]) => total)
          .reduce((prev, current) => prev + current, 0);

        return sumOfTechnologiesTotal > 0 || !hideEmptyCategoryOptions
          ? [
              ...prev,
              toOption({
                key: currentGroup,
                node: !hideEmptyCategoryOptions
                  ? `${currentGroup} (${numberOfTechnologies})`
                  : currentGroup,
              }),
            ]
          : prev;
      }, [] as OptionWithValue[]);
    } else {
      return ALL_TECHNOLOGY_GROUPS.map((elem) =>
        toOption({ key: elem, node: elem })
      );
    }
  }, [hideEmptyCategoryOptions, applications, toOption]);

  return {
    applications: applications,
    categoryOptions: allCategoryOptions,
    allApplications,
    allTechnologies,
  };
};