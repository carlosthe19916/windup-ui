import { ApplicationIgnoredFiles } from "api/models";

export let MOCK_IGNORED_FILES: ApplicationIgnoredFiles[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const application1Deps: ApplicationIgnoredFiles = {
    applicationId: "app-1",
    ignoredFiles: [
      {
        fileName: "randomfile1",
        filePath: "randomfile1Path",
        reason: "randomfile1Reason",
      },
    ],
  };

  const application2Deps: ApplicationIgnoredFiles = {
    applicationId: "app-2",
    ignoredFiles: [
      {
        fileName: "randomfile2",
        filePath: "randomfile2Path",
        reason: "randomfile2Reason",
      },
    ],
  };

  MOCK_IGNORED_FILES = (window as any)["ignored-files"] || [
    application1Deps,
    application2Deps,
  ];
}
