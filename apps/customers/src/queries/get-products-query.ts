import { Product } from "@shared/models/product-model";
import { AxiosError } from "axios";
import {
  QueryClient,
  UseQueryOptions,
  useQuery as useRQQuery,
} from "@tanstack/react-query";
import { http } from "@shared/lib/http";

export namespace GetProductsQuery {
  export type Variables = {
    appId?: string;
    subscriptionStatus?: "Active" | "Inactive";
  };
  export type Data = Array<Product>;
  export type Error = AxiosError;

  export const key = ["products"];
  export const getKey = (variables: Variables) => [...key, variables];

  export const queryFn = ({ appId, ...params }: Variables) =>
    http
      .get<Data>(`/apps/${appId}/products`, { params })
      .then((res) => res.data);

  export const useQuery = (
    variables: Variables,
    options: Omit<UseQueryOptions<Data, Error>, "queryKey"> = {},
  ) => {
    return useRQQuery({
      ...options,
      queryKey: getKey(variables),
      queryFn: () => queryFn(variables),
      enabled: Boolean(variables.appId) && options?.enabled !== false,
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
}
