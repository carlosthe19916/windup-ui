import { ApplicationIssues } from "api/models";

export let MOCK_ISSUES: ApplicationIssues[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const issuesApp1: ApplicationIssues = {
    applicationId: "app-1",
    issues: {
      mandatory: [
        {
          id: "app1-issue-mandatory-1",
          name: "App1: Issue mandatory 1",
          levelOfEffort: "Level description",
          ruleId: "rule-1",
          links: [
            { title: "Link1", href: "http://windup1.com" },
            { title: "Link2", href: "http://windup2.com" },
          ],
          affectedFiles: [{ description: "Hint text", files: [] }],
        },
      ],
      optional: [
        {
          id: "app1-issue-optional-1",
          name: "App1: Issue optional 1",
          levelOfEffort: "Level description",
          ruleId: "rule-2",
          links: [
            { title: "Link1", href: "http://windup1.com" },
            { title: "Link2", href: "http://windup2.com" },
          ],
          affectedFiles: [],
        },
      ],
      potential: [],
      information: [],
    },
  };

  const issuesApp2: ApplicationIssues = {
    applicationId: "app-2",
    issues: {
      mandatory: [
        {
          id: "app2-issue-mandatory-1",
          name: "App2: Issue mandatory 1",
          levelOfEffort: "Level description",
          ruleId: "rule-1",
          links: [
            { title: "Link1", href: "http://windup1.com" },
            { title: "Link2", href: "http://windup2.com" },
          ],
          affectedFiles: [],
        },
      ],
      optional: [
        {
          id: "app2-issue-optional-1",
          name: "Issue optional 1",
          levelOfEffort: "Level description",
          ruleId: "rule-2",
          links: [
            { title: "Link1", href: "http://windup1.com" },
            { title: "Link2", href: "http://windup2.com" },
          ],
          affectedFiles: [],
        },
      ],
      potential: [],
      information: [],
    },
  };

  MOCK_ISSUES = (window as any)["issues"] || [issuesApp1, issuesApp2];
}
