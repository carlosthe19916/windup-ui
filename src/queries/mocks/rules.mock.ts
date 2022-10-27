import { Rule, RuleContent, RuleGroup } from "api/models";

export let MOCK_RULES: RuleGroup;
export let MOCK_RULES_CONTENT: { [id: string]: RuleContent } = {};

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const rule1: Rule = {
    id: "rule-1",
    sourceTechnology: [{ id: "source1" }],
    targetTechnology: [
      { id: "target1", versionRange: "[6,8)" },
      { id: "target2", versionRange: "[6,)" },
    ],
  };

  const rule2: Rule = {
    id: "rule-2",
    targetTechnology: [{ id: "target3" }],
  };

  MOCK_RULES = (window as any)["rules"] || {
    phase1: [rule1],
    phase2: [rule2],
  };

  MOCK_RULES_CONTENT = (window as any)["rules_by_id"] || {
    [rule1.id]: { id: rule1.id, content: "<rule></rule>" },
    [rule2.id]: { id: rule2.id, content: "<rule></rule>" },
  };
}
