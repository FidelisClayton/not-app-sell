import { Product } from "@shared/models";
import { AxiosError } from "axios";
import {
  QueryClient,
  UseQueryOptions,
  useQuery as useRQQuery,
} from "@tanstack/react-query";
import { http } from "@shared/lib/http";

export namespace GetLatestProductQuery {
  export type Variables = null;
  export type Data = Product;
  export type Error = AxiosError;

  export const key = ["products", "latest"];

  export const queryFn = () =>
    http.get<Data>(`/latest-product`).then((res) => res.data);

  export const useQuery = (
    options: Omit<UseQueryOptions<Data, Error>, "queryKey"> = {},
  ) => {
    return useRQQuery({
      ...options,
      queryKey: key,
      queryFn: () => queryFn(),
    });
  };

  export const fetchQuery = (queryClient: QueryClient) => {
    return queryClient.fetchQuery<Data>({
      queryKey: key,
      queryFn: () => queryFn(),
    });
  };

  export const invalidateQuery = (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: key });
  };
}
