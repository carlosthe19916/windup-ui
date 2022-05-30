import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import { UseQueryResult } from "react-query";

import { Label } from "api/models";
import { useMockableQuery } from "./helpers";
import { MOCK_LABELS } from "./mocks/labels.mock";

export const useLabelsQuery = (): UseQueryResult<Label[], AxiosError> => {
  const sortListCallback = useCallback((data: Label[]): Label[] => {
    return data.sort((a, b) => b.name.localeCompare(a.name));
  }, []);

  return useMockableQuery<Label[], AxiosError>(
    {
      queryKey: "labels",
      queryFn: async () => (await axios.get<Label[]>("/labels")).data,
      select: sortListCallback,
    },
    MOCK_LABELS
  );
};
