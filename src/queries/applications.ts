import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { Application } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_APPLICATIONS } from "./mocks/applications.mock";

export const useApplicationsQuery = (): UseQueryResult<
  Application[],
  AxiosError
> => {
  const sortListCallback = useCallback((data: Application[]): Application[] => {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return useMockableQuery<Application[], AxiosError>(
    {
      queryKey: ["applications"],
      queryFn: async () =>
        (await axios.get<Application[]>("/applications")).data,
      select: sortListCallback,
    },
    MOCK_APPLICATIONS
  );
};
