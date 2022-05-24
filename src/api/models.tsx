export interface Application {
  id: number;
  name: string;
  tags: string[];
  runtimeLabels: string[];
  storyPoints: number;
  incidents: {
    mandatory: number;
    optional: number;
    potential: number;
    information: number;
  };
}
