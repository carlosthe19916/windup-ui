import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { Dependency, DependencyApplication } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_DEPENDENCIES } from "./mocks/dependencies.mock";

export const useDependenciesQuery = (): UseQueryResult<
  DependencyApplication[],
  AxiosError
> => {
  const mapCallback = useCallback(
    (data: { [key: string]: Dependency[] }): DependencyApplication[] => {
      return Object.entries(data).reduce((prev, [key, value]) => {
        return [
          ...prev,
          {
            applicationId: key,
            dependencies: value.sort((a, b) => a.name.localeCompare(b.name)),
          },
        ];
      }, [] as DependencyApplication[]);
    },
    []
  );

  return useMockableQuery<
    { [key: string]: Dependency[] },
    AxiosError,
    DependencyApplication[]
  >(
    {
      queryKey: ["dependencies"],
      queryFn: async () => {
        const url = "/dependencies";
        return (await axios.get<{ [key: string]: Dependency[] }>(url)).data;
      },
      select: mapCallback,
    },
    MOCK_DEPENDENCIES
  );
};
