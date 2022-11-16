import { ApplicationPackageIncidents as ApplicationPackagesIncidents } from "api/models";

export let MOCK_PACKAGES: ApplicationPackagesIncidents[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const application1Deps: ApplicationPackagesIncidents = {
    applicationId: "app-1",
    packages: {
      package1: 1,
      package2: 2,
    },
  };

  const application2Deps: ApplicationPackagesIncidents = {
    applicationId: "app-2",
    packages: {
      package1: 1,
      package2: 2,
    },
  };

  MOCK_PACKAGES = (window as any)["packages-incidents"] || [
    application1Deps,
    application2Deps,
  ];
}
