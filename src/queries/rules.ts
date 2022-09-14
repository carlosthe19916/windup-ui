import { useCallback } from "react";
import axios, { AxiosError } from "axios";

import { RuleGroup } from "api/models";
import { RuleProcessed } from "api/processed-models";
import { useMockableQuery } from "./helpers";
import { MOCK_RULES } from "./mocks/rules.mock";

export const useRulesQuery = () => {
  const transformCallback = useCallback((data: RuleGroup) => {
    let result: RuleProcessed[] = [];

    for (const [key, value] of Object.entries(data)) {
      const rulesFromPhase = value.map((e) => {
        const processedRule: RuleProcessed = { ...e, phase: key };
        return processedRule;
      });

      result = result.concat(rulesFromPhase);
    }

    return result;
  }, []);

  return useMockableQuery<RuleGroup, AxiosError, RuleProcessed[]>(
    {
      queryKey: ["rules"],
      queryFn: async () => (await axios.get<RuleGroup>("/rules")).data,
      select: transformCallback,
    },
    MOCK_RULES
  );
};
