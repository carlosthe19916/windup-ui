import { ApplicationDetails } from "api/models";

export let MOCK_APPLICATIONS_DETAILS: ApplicationDetails[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const application1Details: ApplicationDetails = {
    applicationId: "app-1",
    messages: [
      {
        value: "message1",
        ruleId: "rule-1",
      },
    ],
    applicationFiles: [
      {
        fileId: "app-file-1",
        fileName: "App file 1",
        rootPath: "/folder/app-file-1",
        storyPoints: 10,
        maven: {
          name: "maven name",
          mavenIdentifier: "maven identifier",
          sha1: "123456789",
          version: "maven version",
          description: "maven description",
          organizations: ["org1", "org2"],
          duplicatePaths: ["path1", "path2"],
        },
        childrenFileIds: ["file-1", "file-2"],
      },
    ],
  };

  const application2Details: ApplicationDetails = {
    applicationId: "app-2",
    messages: [
      {
        value: "message2",
        ruleId: "rule-2",
      },
    ],
    applicationFiles: [
      {
        fileId: "app-file-2",
        fileName: "App file 2",
        rootPath: "/folder/app-file-2",
        storyPoints: 10,
        maven: {
          name: "maven name",
          mavenIdentifier: "maven identifier",
          sha1: "123456789",
          version: "maven version",
          description: "maven description",
          organizations: ["org1", "org2"],
          duplicatePaths: ["path1", "path2"],
        },
        childrenFileIds: ["file-1", "file-2"],
      },
    ],
  };

  MOCK_APPLICATIONS_DETAILS = (window as any)["applications-details"] || [
    application1Details,
    application2Details,
  ];
}
