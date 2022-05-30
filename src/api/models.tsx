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
