import { useCallback } from "react";
import axios, { AxiosError } from "axios";

import { ApplicationTechnologies } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_TECHNOLOGIES } from "./mocks/technologies.mock";
import {
  ApplicationTechnologiesProcessed,
  TechnologyGroupsProcessed,
  TechnologyValueProcessed,
} from "api/processed-models";

export const useTechnologiesQuery = () => {
  const transformCallback = useCallback(
    (data: ApplicationTechnologies[]): ApplicationTechnologiesProcessed[] => {
      const result = data.map((appTech) => {
        const technologyGroupsMapped = Object.entries(appTech.technologyGroups)
          .map(([groupName, groupValue]) => {
            const groupValueMapped = Object.entries(groupValue)
              .map(([technologyName, technologyValue]) => {
                const total = Object.entries(technologyValue).reduce(
                  (prev, [tagName, tagValue]) => {
                    return prev + tagValue;
                  },
                  0
                );

                const technologyValueMapped: TechnologyValueProcessed = {
                  total,
                  tags: { ...technologyValue },
                };

                return {
                  [technologyName]: technologyValueMapped,
                };
              })
              .reduce((prev, current) => {
                return { ...prev, ...current };
              }, {});

            return {
              [groupName]: groupValueMapped,
            };
          })
          .reduce((prev, current) => {
            return { ...prev, ...current };
          }, {});

        return {
          applicationId: appTech.applicationId,
          technologyGroups: technologyGroupsMapped as TechnologyGroupsProcessed,
        };
      });

      return result;
    },
    []
  );

  return useMockableQuery<
    ApplicationTechnologies[],
    AxiosError,
    ApplicationTechnologiesProcessed[]
  >(
    {
      queryKey: ["technologies"],
      queryFn: async () => {
        const url = "/technologies";
        return (await axios.get<ApplicationTechnologies[]>(url)).data;
      },
      select: transformCallback,
    },
    MOCK_TECHNOLOGIES
  );
};
