import { useCallback } from "react";
import axios, { AxiosError } from "axios";

import { ApplicationTechnologies } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_TECHNOLOGIES } from "./mocks/technologies.mock";

export const useTechnologiesQuery = () => {
  const transformCallback = useCallback((data: ApplicationTechnologies[]) => {
    data.forEach((applicationTechnology) => {
      Object.entries(applicationTechnology.technologyGroups).forEach(
        ([groupName, groupValue]) => {
          Object.entries(groupValue).forEach(
            ([technologyName, technologyValue]) => {
              const { total, ...rest } = technologyValue;
              const totalSum = Object.entries(rest).reduce(
                (prev, [tagName, tagValue]) => {
                  return prev + tagValue;
                },
                0
              );
              technologyValue.total = totalSum;
            }
          );
        }
      );
    });

    return data;
  }, []);

  return useMockableQuery<
    ApplicationTechnologies[],
    AxiosError,
    ApplicationTechnologies[]
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
