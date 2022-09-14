import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { AppFile } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_APP_FILES } from "./mocks/files.mock";

export const useFilesQuery = (): UseQueryResult<AppFile[], AxiosError> => {
  return useMockableQuery<AppFile[], AxiosError>(
    {
      queryKey: ["AppFiles"],
      queryFn: async () => (await axios.get<AppFile[]>("/files")).data,
    },
    MOCK_APP_FILES
  );
};
