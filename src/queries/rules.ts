import axios, { AxiosError } from "axios";
import { UseQueryResult } from "react-query";

import { Rule } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_RULES } from "./mocks/rules.mock";

export const useRulesQuery = (): UseQueryResult<Rule[], AxiosError> => {
  return useMockableQuery<Rule[], AxiosError>(
    {
      queryKey: "rules",
      queryFn: async () => (await axios.get<Rule[]>("/rules")).data,
    },
    MOCK_RULES
  );
};
