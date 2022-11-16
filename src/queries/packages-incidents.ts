import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { ApplicationPackageIncidents } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_PACKAGES } from "./mocks/packages-incidents.mock";

export const usePackagesIncidentsQuery = (): UseQueryResult<
  ApplicationPackageIncidents[],
  AxiosError
> => {
  return useMockableQuery<
    ApplicationPackageIncidents[],
    AxiosError,
    ApplicationPackageIncidents[]
  >(
    {
      queryKey: ["packages-incidents"],
      queryFn: async () => {
        const url = "/packages-incidents";
        return (await axios.get<ApplicationPackageIncidents[]>(url)).data;
      },
    },
    MOCK_PACKAGES
  );
};
