import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { ApplicationDto } from "api/application";
import { useMockableQuery } from "./helpers";
import { MOCK_APPLICATIONS } from "./mocks/applications.mock";

export const useApplicationsQuery = (): UseQueryResult<
  ApplicationDto[],
  AxiosError
> => {
  const sortListCallback = useCallback(
    (data: ApplicationDto[]): ApplicationDto[] => {
      return data.sort((a, b) => a.name.localeCompare(b.name));
    },
    []
  );

  return useMockableQuery<ApplicationDto[], AxiosError>(
    {
      queryKey: ["applications"],
      queryFn: async () =>
        (await axios.get<ApplicationDto[]>("/applications")).data,
      select: sortListCallback,
    },
    MOCK_APPLICATIONS,
    (window as any)["applications"]
  );
};
