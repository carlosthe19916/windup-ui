import { AppFile } from "api/models";

export let MOCK_APP_FILES: AppFile[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const file1: AppFile = {
    id: "file-1",
    fullPath: "file.jar",
    prettyPath: "file.jar",
    sourceType: "binary",
    hints: [
      {
        line: 1,
        title: "Title",
        ruleId: "rule-1",
        content: "hint content",
        links: [],
      },
    ],
    fileContent: "file content",
  };

  MOCK_APP_FILES = (window as any)["files"] || [file1];
}
