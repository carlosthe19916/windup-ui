import { AppFile } from "api/models";

export let MOCK_APP_FILES: AppFile[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const file1: AppFile = {
    id: "file-1",
    fullPath: "org.jboss.file1.jar",
    prettyPath: "file1.jar",
    sourceType: "binary",
    hints: [
      {
        line: 37,
        title: "Title",
        ruleId: "rule-1",
        content: "content",
        links: [],
      },
    ],
    fileContent: "",
  };

  MOCK_APP_FILES = (window as any)["files"] || [file1];
}
