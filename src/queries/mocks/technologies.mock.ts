import { ApplicationTechnologies } from "api/models";

export let MOCK_TECHNOLOGIES: ApplicationTechnologies[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const application1Deps: ApplicationTechnologies = {
    applicationId: "app-1",
    technologyGroups: {
      View: {
        Web: {
          total: 2,
          "Web XML File": 1,
          "Weblogic Web XML": 1,
        },
      },
      Connect: {},
      Store: {},
      Sustain: {},
      Execute: {},
    },
  };

  const application2Deps: ApplicationTechnologies = {
    applicationId: "app-2",
    technologyGroups: {
      View: {},
      Connect: {
        Streaming: {
          total: 0,
        },
      },
      Store: {},
      Sustain: {},
      Execute: {},
    },
  };

  MOCK_TECHNOLOGIES = (window as any)["technologies"] || [
    application1Deps,
    application2Deps,
  ];
}
