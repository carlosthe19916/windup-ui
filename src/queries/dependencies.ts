import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { ApplicationDependencies } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_DEPENDENCIES } from "./mocks/dependencies.mock";

export const useDependenciesQuery = (): UseQueryResult<
  ApplicationDependencies[],
  AxiosError
> => {
  const mapCallback = useCallback(
    (data: ApplicationDependencies[]): ApplicationDependencies[] => {
      return data.map((app) => ({
        ...app,
        dependencies: app.dependencies.sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));
    },
    []
  );

  return useMockableQuery<
    ApplicationDependencies[],
    AxiosError,
    ApplicationDependencies[]
  >(
    {
      queryKey: ["dependencies"],
      queryFn: async () => {
        const url = "/dependencies";
        return (await axios.get<ApplicationDependencies[]>(url)).data;
      },
      select: mapCallback,
    },
    MOCK_DEPENDENCIES
  );
};
