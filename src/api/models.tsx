export interface Application {
  id: number;
  name: string;
  tags: string[];
  storyPoints: number;
  incidents: {
    mandatory: number;
    optional: number;
    potential: number;
    information: number;
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
  application: {
    id: number;
  };
  issues: Issue[];
}

export interface Issue {
  id: string;
  levelOfEffort: string;
  category: "mandatory" | "potential" | "optional" | "information";
  rule: { id: string };
}

export interface Technology {
  id: string;
  versionRange?: string;
}

export interface Rule {
  id: string;
  title: string;
  definition: string;
  sourceTechnology?: Technology[];
  targetTechnology?: Technology[];
  affectedFiles: {
    id: string;
  }[];

  message: string;
  links: {
    title: string;
    href: string;
  }[];
}

export interface AppFile {
  id: string;
  filename: string;
  fileContent?: string;
  hints: Hint[];
}

export interface Hint {
  line?: number;
  rule: { id: string };
}
