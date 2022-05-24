import { useQuery, UseQueryOptions } from "react-query";

const mockPromise = <TQueryFnData>(
  data: TQueryFnData,
  timeout = process.env.NODE_ENV === "test" ? 0 : 1000,
  success = true
) => {
  return new Promise<TQueryFnData>((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve(data);
      } else {
        reject({ message: "Error" });
      }
    }, timeout);
  });
};

export const useMockableQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData
>(
  params: UseQueryOptions<TQueryFnData, TError, TData>,
  mockData: TQueryFnData
) =>
  useQuery<TQueryFnData, TError, TData>({
    ...params,
    queryFn:
      process.env.REACT_APP_DATA_SOURCE !== "mock"
        ? params.queryFn
        : () => mockPromise(mockData),
  });
