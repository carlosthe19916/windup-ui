import { ApplicationIssues } from "api/models";

export let MOCK_ISSUES: ApplicationIssues[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const issuesApp1: ApplicationIssues = {
    application: { id: "administracionefectivoear" },
    issues: [
      {
        id: "1",
        levelOfEffort: "Complex change with documented solution",
        category: "mandatory",
        rule: {
          id: "embedded-framework-libraries-02000",
        },
      },
      {
        id: "2",
        levelOfEffort: "Trivial change or 1-1 library swap",
        category: "mandatory",
        rule: { id: "environment-dependent-calls-02000" },
      },
    ],
  };

  MOCK_ISSUES = [issuesApp1];
}
