import { Issue, Rule } from "./models";

export interface ApplicationIssuesProcessed {
  applicationId: string;
  issues: IssueProcessed[];
}

export interface IssueProcessed extends Issue {
  category: "mandatory" | "optional" | "potential" | "information";
}

export interface RuleProcessed extends Rule {
  phase: string;
}
