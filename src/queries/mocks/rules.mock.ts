import { Rule, RuleGroup } from "api/models";

export let MOCK_RULES: RuleGroup;

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const rule1: Rule = {
    id: "rule-1",
    content: "<rule></rule>",
    sourceTechnology: [{ id: "source1" }],
    targetTechnology: [
      { id: "target1", versionRange: "[6,8)" },
      { id: "target2", versionRange: "[6,)" },
    ],
  };

  const rule2: Rule = {
    id: "rule-2",
    content: "<rule></rule>",
    targetTechnology: [{ id: "target3" }],
  };

  MOCK_RULES = (window as any)["rules"] || {
    phase1: [rule1],
    phase2: [rule2],
  };
}
