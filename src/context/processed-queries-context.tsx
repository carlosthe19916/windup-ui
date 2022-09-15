import { createContext, useContext, useMemo } from "react";

import { useIssuesQuery } from "queries/issues";
import { useRulesQuery } from "queries/rules";

import { Technology } from "api/models";
import { RuleProcessed } from "api/processed-models";
import { technologiesToArray } from "utils/rule-utils";

interface IProcessedQueriesContext {
  rulesByIssueId: Map<string, RuleProcessed>;
  technologies: {
    source: string[];
    target: string[];
  };
}

const ProcessedQueriesContext = createContext<IProcessedQueriesContext>({
  rulesByIssueId: new Map(),
  technologies: { source: [], target: [] },
});

export const ProcessedQueriesContextProvider: React.FC = ({ children }) => {
  const allIssues = useIssuesQuery();
  const allRules = useRulesQuery();

  const technologies = useMemo(() => {
    const source = technologiesToArray(
      (allRules.data || [])
        .flatMap((e) => e.sourceTechnology)
        .reduce((prev, current) => {
          return current ? [...prev, current] : prev;
        }, [] as Technology[])
    );
    const target = technologiesToArray(
      (allRules.data || [])
        .flatMap((e) => e.targetTechnology)
        .reduce((prev, current) => {
          return current ? [...prev, current] : prev;
        }, [] as Technology[])
    );
    return { source, target };
  }, [allRules.data]);

  const rulesByIssueId = useMemo(() => {
    const result = new Map<string, RuleProcessed>();
    if (
      allIssues.isFetched &&
      allRules.isFetched &&
      allIssues.data &&
      allRules.data
    ) {
      allIssues.data
        .flatMap((f) => f.issues)
        .forEach((issue) => {
          const rule = allRules.data.find((rule) => rule.id === issue.ruleId);
          if (rule) {
            result.set(issue.id, rule);
          }
        });
    }
    return result;
  }, [allIssues.isFetched, allRules.isFetched, allIssues.data, allRules.data]);

  return (
    <ProcessedQueriesContext.Provider value={{ technologies, rulesByIssueId }}>
      {children}
    </ProcessedQueriesContext.Provider>
  );
};

export const useProcessedQueriesContext = () =>
  useContext(ProcessedQueriesContext);
