import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { AppFile, AppFileContent } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_APP_FILES, MOCK_APP_FILES_CONTENT } from "./mocks/files.mock";

export const useFilesQuery = (): UseQueryResult<AppFile[], AxiosError> => {
  return useMockableQuery<AppFile[], AxiosError>(
    {
      queryKey: ["files"],
      queryFn: async () => (await axios.get<AppFile[]>("/files")).data,
    },
    MOCK_APP_FILES
  );
};

export const useFileQuery = (fileId: string) => {
  return useMockableQuery<AppFileContent, AxiosError, AppFileContent>(
    {
      queryKey: ["files", fileId],
      queryFn: async () =>
        (await axios.get<AppFileContent>(`/files/${fileId}`)).data,
    },
    MOCK_APP_FILES_CONTENT[fileId]
  );
};
