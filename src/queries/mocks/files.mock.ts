import { AppFile, AppFileContent } from "api/models";

export let MOCK_APP_FILES: AppFile[];
export let MOCK_APP_FILES_CONTENT: { [id: string]: AppFileContent } = {};

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
  };

  MOCK_APP_FILES = (window as any)["files"] || [file1];

  MOCK_APP_FILES_CONTENT = (window as any)["files_by_id"] || {
    [file1.id]: { id: file1.id, content: "file content" },
  };
}
