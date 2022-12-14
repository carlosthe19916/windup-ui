import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { ApplicationDetails } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_APPLICATIONS_DETAILS } from "./mocks/application-details.mock";

export const useApplicationsDetailsQuery = (): UseQueryResult<
  ApplicationDetails[],
  AxiosError
> => {
  return useMockableQuery<ApplicationDetails[], AxiosError>(
    {
      queryKey: ["applications-details"],
      queryFn: async () =>
        (await axios.get<ApplicationDetails[]>("/applications-details")).data,
    },
    MOCK_APPLICATIONS_DETAILS
  );
};
