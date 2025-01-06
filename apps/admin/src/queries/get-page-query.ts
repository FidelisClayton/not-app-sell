import { PageDocument } from "@shared/models";
import { AxiosError } from "axios";
import {
  QueryClient,
  UseQueryOptions,
  useQuery as useRQQuery,
} from "@tanstack/react-query";
import { http } from "@shared/lib/http";

export namespace GetPageQuery {
  export type Variables = {
    pageId?: string;
  };
  export type Data = PageDocument;
  export type Error = AxiosError;

  export const key = ["pages"];
  export const getKey = (variables: Variables) => [...key, variables];

  export const queryFn = ({ pageId }: Variables) =>
    http.get<Data>(`/pages/${pageId}`).then((res) => res.data);

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

  export const invalidateQuery = (
    queryClient: QueryClient,
    variables: Variables,
  ) => {
    return queryClient.invalidateQueries({ queryKey: getKey(variables) });
  };
}
