import { Page } from "@/models";
import { AxiosError } from "axios";
import {
  QueryClient,
  UseQueryOptions,
  useQuery as useRQQuery,
} from "@tanstack/react-query";
import { http } from "@/lib/http";

export namespace GetPagesQuery {
  export type Variables = { productId?: string };
  export type Data = Array<Page>;
  export type Error = AxiosError;

  export const key = ["pages"];
  export const getKey = (variables: Variables) => [...key, variables];

  export const queryFn = ({ productId }: Variables) =>
    http.get<Data>(`/products/${productId}/pages`).then((res) => res.data);

  export const useQuery = (
    variables: Variables,
    options: Omit<UseQueryOptions<Data, Error>, "queryKey"> = {},
  ) => {
    return useRQQuery({
      ...options,
      queryKey: getKey(variables),
      queryFn: () => queryFn(variables),
      enabled: Boolean(variables.productId) && options?.enabled !== false,
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
