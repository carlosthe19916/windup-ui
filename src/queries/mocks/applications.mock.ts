import { Application } from "api/models";

export let MOCK_APPLICATIONS: Application[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const application1: Application = {
    id: "app-1",
    name: "app1.jar",
    tags: ["tag1", "tag2"],
    storyPoints: 45,
    incidents: {
      mandatory: 7,
      optional: 27,
      potential: 5,
      information: 68,
    },
  };

  const application2: Application = {
    id: "app-2",
    name: "app2.jar",
    tags: ["tag1", "tag2"],
    storyPoints: 90,
    incidents: { mandatory: 53, optional: 1, potential: 38, information: 11 },
  };

  MOCK_APPLICATIONS = (window as any)["applications"] || [
    application1,
    application2,
  ];
}
