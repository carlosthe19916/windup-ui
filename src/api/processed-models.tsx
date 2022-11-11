import { Issue, Rule, TechnologyGroup } from "./models";

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

export interface TechnologyTagValue {
  [tagName: string]: number;
}

export interface TechnologyValueProcessed {
  total: number;
  tags: TechnologyTagValue;
}

export interface TechnologyGroupValueProcessed {
  [technologyName: string]: TechnologyValueProcessed;
}

export type TechnologyGroupsProcessed = {
  [groupName in TechnologyGroup]: TechnologyGroupValueProcessed;
};

export interface ApplicationTechnologiesProcessed {
  applicationId: string;
  technologyGroups: TechnologyGroupsProcessed;
}
