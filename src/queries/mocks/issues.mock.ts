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
          id: "app1-issue-1",
          name: "Issue name",
          levelOfEffort: "Level description",
          totalIncidents: 1,
          totalStoryPoints: 1,
          ruleId: "rule-1",
          links: [
            { title: "Link1", href: "http://windup1.com" },
            { title: "Link2", href: "http://windup2.com" },
          ],
          affectedFiles: [
            {
              description: "Hint text",
              files: [{ fileId: "file-1", fileName: "file1", occurrences: 1 }],
            },
          ],
        },
      ],
    },
  };

  const issuesApp2: ApplicationIssues = {
    applicationId: "app-2",
    issues: {
      optional: [
        {
          id: "app2-issue-1",
          name: "Issue name",
          levelOfEffort: "Level description",
          totalIncidents: 1,
          totalStoryPoints: 2,
          ruleId: "rule-2",
          links: [
            { title: "Link1", href: "http://windup1.com" },
            { title: "Link2", href: "http://windup2.com" },
          ],
          affectedFiles: [
            {
              description: "Hint text",
              files: [{ fileId: "file-2", fileName: "file2", occurrences: 1 }],
            },
          ],
        },
      ],
      potential: [],
      information: [],
    },
  };

  MOCK_ISSUES = (window as any)["issues"] || [issuesApp1, issuesApp2];
}
