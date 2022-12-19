import { SystemTag } from "api/models";

export let MOCK_TAGS: SystemTag[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const tag1: SystemTag = {
    name: "tag1",
    title: "Tag1",
    isRoot: true,
    isPseudo: false,
    parentsTagNames: [],
  };

  MOCK_TAGS = (window as any)["tags"] || [tag1];
}
