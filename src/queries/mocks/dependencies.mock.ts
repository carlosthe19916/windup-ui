import { Dependency, DependencyApplication } from "api/models";

export let MOCK_DEPENDENCIES: { [key: string]: Dependency[] };

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const application1Deps: Dependency[] = [
    {
      name: "dep1.jar",
      sha1: "1234",
      version: "1.0",
      foundPaths: ["path1"],
    },
  ];

  const application2Deps: Dependency[] = [
    {
      name: "dep2.jar",
      sha1: "4321",
      version: "2.0",
      foundPaths: ["path2"],
    },
  ];

  MOCK_DEPENDENCIES = (window as any)["dependencoes"] || {
    "app-1": application1Deps,
    "app-2": application2Deps,
  };
}
