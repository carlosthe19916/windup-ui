import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { ApplicationPackageIncidentsDto } from "api/application-package-incidents";
import { useMockableQuery } from "./helpers";
import { MOCK_PACKAGES } from "./mocks/packages-incidents.mock";

export const usePackagesIncidentsQuery = (): UseQueryResult<
  ApplicationPackageIncidentsDto[],
  AxiosError
> => {
  return useMockableQuery<
    ApplicationPackageIncidentsDto[],
    AxiosError,
    ApplicationPackageIncidentsDto[]
  >(
    {
      queryKey: ["packages-incidents"],
      queryFn: async () => {
        const url = "/packages-incidents";
        return (await axios.get<ApplicationPackageIncidentsDto[]>(url)).data;
      },
    },
    MOCK_PACKAGES
  );
};
