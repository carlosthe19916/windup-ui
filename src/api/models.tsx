export const ALL_SUPPORTED_ISSUE_CATEGORY = [
  "mandatory",
  "optional",
  "potential",
  "information",
  "cloud-mandatory",
  "cloud-optional",
] as const;
export type IssueCategoryType = typeof ALL_SUPPORTED_ISSUE_CATEGORY[number];

export const ALL_LEVEL_OF_EFFORTS = [
  "Info",
  "Trivial",
  "Complex",
  "Redesign",
  "Architectural",
  "Unknown",
] as const;
export type LevelOfEffortType = typeof ALL_LEVEL_OF_EFFORTS[number];

export interface Application {
  id: string;
  name: string;
  tags: string[];
  storyPoints: number;
  incidents: {
    [category in IssueCategoryType]: number;
  };
}

export interface Label {
  id: string;
  name: string;
  description?: string;
  supported: string[];
  unsuitable: string[];
  neutral: string[];
}

export interface ApplicationIssues {
  applicationId: string;
  issues: {
    [category in IssueCategoryType]: Issue[];
  };
}

export interface Issue {
  id: string;
  name: string;
  ruleId: string;
  effort: {
    type: LevelOfEffortType;
    points: number;
    description: string;
  };
  totalIncidents: number;
  totalStoryPoints: number;
  links: Link[];
  affectedFiles: IssueAffectedFiles[];
}

export interface IssueAffectedFiles {
  description: string;
  files: IssueFile[];
}

export interface IssueFile {
  fileId: string;
  fileName: string;
  occurrences: number;
}

export interface RuleGroup {
  [key: string]: Rule[];
}

export interface Rule {
  id: string;
  sourceTechnology?: Technology[];
  targetTechnology?: Technology[];
}

export interface RuleContent {
  id: string;
  content: string;
}

export interface AppFile {
  id: string;
  fullPath: string;
  prettyPath: string;
  sourceType: string;
  hints: Hint[];
}

export interface AppFileContent {
  id: string;
  content: string;
}

export interface Hint {
  line: number;
  title: string;
  ruleId: string;
  content: string;
  links: Link[];
}

export interface Link {
  title: string;
  href: string;
}

export interface Technology {
  id: string;
  versionRange?: string;
}

export interface Dependency {
  name: string;
  mavenIdentifier?: string;
  sha1?: string;
  version: string;
  organization?: string;
  foundPaths: string[];
}

export interface ApplicationDependencies {
  applicationId: string;
  dependencies: Dependency[];
}

export const ALL_TECHNOLOGY_GROUPS = [
  "View",
  "Connect",
  "Store",
  "Sustain",
  "Execute",
] as const;
export type TechnologyGroup = typeof ALL_TECHNOLOGY_GROUPS[number];

export type TechnologyDetails = {
  [key: string]: {
    [key: string]: number;
  };
};

export interface ApplicationTechnologies {
  applicationId: string;
  technologyGroups: { [key in TechnologyGroup]: TechnologyDetails };
}

export interface ApplicationIgnoredFiles {
  applicationId: string;
  ignoredFiles: IgnoredFile[];
}

export interface IgnoredFile {
  fileName: string;
  filePath: string;
  reason: string;
}

export interface ApplicationPackageIncidents {
  applicationId: string;
  packages: { [key: string]: number };
}
