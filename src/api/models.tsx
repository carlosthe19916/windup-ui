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
  incidents: Incident[];
}

export interface Incident {
  hint: string;
  rule: string;
  storyPoints: number;
  files: {
    filename: string;
    incidentsFound: number;
  }[];
}
