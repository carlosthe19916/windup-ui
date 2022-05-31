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

export interface Issue {
  name: string;
  category: "mandatory" | "potential" | "optional" | "information";
  levelOfEffort: string;
  incident: Incident;
}

export interface Incident {
  storyPoints: number;
  files: {
    name: string;
    incidentsFound: number;
    content?: string;
    comment?: {
      line: number;
      title: string;
      content: string;
      links: { title: string; href: string }[];
    };
  }[];
  hint: {
    description: string;
    links: { title: string; href: string }[];
  };
  rule: {
    name: string;
    content: string;
    sourceTechnology?: {
      id: string;
      versionRange?: string;
    }[];
    targetTechnology?: {
      id: string;
      versionRange?: string;
    }[];
  };
}

export interface ApplicationIssues {
  application: {
    id: number;
    name: string;
  };
  issues: Issue[];
}
