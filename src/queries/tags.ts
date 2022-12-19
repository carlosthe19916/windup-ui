import axios, { AxiosError } from "axios";

import { SystemTag } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_TAGS } from "./mocks/tags.mock";

export const useTagsQuery = () => {
  return useMockableQuery<SystemTag[], AxiosError>(
    {
      queryKey: ["tags"],
      queryFn: async () => (await axios.get<SystemTag[]>("/tags")).data,
    },
    MOCK_TAGS
  );
};
