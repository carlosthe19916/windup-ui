import axios, { AxiosError } from "axios";
import { UseQueryResult } from "react-query";

import { ApplicationIssues } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_ISSUES } from "./mocks/issues.mock";

export const useIssuesQuery = (): UseQueryResult<
  ApplicationIssues[],
  AxiosError
> => {
  return useMockableQuery<ApplicationIssues[], AxiosError>(
    {
      queryKey: "issues",
      queryFn: async () =>
        (await axios.get<ApplicationIssues[]>("/issues")).data,
    },
    MOCK_ISSUES
  );
};
