import { AxiosError } from "axios";
import {
  QueryClient,
  UseQueryOptions,
  useQuery as useRQQuery,
} from "@tanstack/react-query";
import { http } from "@/lib/http";
import { Block } from "@/models/block-model";

export namespace GetBlocksQuery {
  export type Variables = { pageId?: string };
  export type Data = Array<Block>;
  export type Error = AxiosError;

  export const key = ["blocks"];
  export const getKey = (variables: Variables) => [...key, variables];

  export const queryFn = ({ pageId }: Variables) =>
    http.get<Data>(`/pages/${pageId}/blocks`).then((res) => res.data);

  export const useQuery = (
    variables: Variables,
    options: Omit<UseQueryOptions<Data, Error>, "queryKey"> = {},
  ) => {
    return useRQQuery({
      ...options,
      queryKey: getKey(variables),
      queryFn: () => queryFn(variables),
      enabled: Boolean(variables.pageId) && options?.enabled !== false,
    });
  };

  export const fetchQuery = (
    queryClient: QueryClient,
    variables: Variables,
  ) => {
    return queryClient.fetchQuery<Data>({
      queryKey: getKey(variables),
      queryFn: () => queryFn(variables),
    });
  };

  export const setQueryData = (
    queryClient: QueryClient,
    variables: Variables,
    callback: (data: Data | undefined) => Data | undefined,
  ) => {
    return queryClient.setQueryData(getKey(variables), callback);
  };

  export const invalidate = (
    queryClient: QueryClient,
    variables: Variables,
  ) => {
    return queryClient.invalidateQueries({
      queryKey: getKey(variables),
    });
  };
}
