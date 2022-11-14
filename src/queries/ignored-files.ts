import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { UseQueryResult } from "@tanstack/react-query";

import { ApplicationIgnoredFiles } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_IGNORED_FILES } from "./mocks/ignored-files.mock";

export const useIgnoredFilesQuery = (): UseQueryResult<
  ApplicationIgnoredFiles[],
  AxiosError
> => {
  const mapCallback = useCallback(
    (data: ApplicationIgnoredFiles[]): ApplicationIgnoredFiles[] => {
      return data.map((app) => ({
        ...app,
        ignoredFiles: app.ignoredFiles.sort((a, b) =>
          a.fileName.localeCompare(b.fileName)
        ),
      }));
    },
    []
  );

  return useMockableQuery<
    ApplicationIgnoredFiles[],
    AxiosError,
    ApplicationIgnoredFiles[]
  >(
    {
      queryKey: ["ignored-files"],
      queryFn: async () => {
        const url = "/ignored-files";
        return (await axios.get<ApplicationIgnoredFiles[]>(url)).data;
      },
      select: mapCallback,
    },
    MOCK_IGNORED_FILES
  );
};
