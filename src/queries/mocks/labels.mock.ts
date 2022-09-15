import { Label } from "api/models";

export let MOCK_LABELS: Label[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const label1: Label = {
    id: "label1",
    name: "Label1",
    description: "Label description",
    supported: ["tag1"],
    unsuitable: ["tag2"],
    neutral: ["tag3"],
  };

  MOCK_LABELS = (window as any)["labels"] || [label1];
}
