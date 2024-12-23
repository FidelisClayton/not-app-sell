import { http } from "@/lib/http";
import { AppDocument } from "@/models/app-model";
import { UseQueryOptions, useQuery as useRQQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export namespace GetAppQuery {
  export type Variables = { id?: string };
  export type Data = AppDocument;
  export type Error = AxiosError;

  export const queryKey = ["get", "app"];

  export const getQueryKey = (variables: Variables) => [...queryKey, variables];

  export const queryFn = (variables: Variables) =>
    http.get(`/apps/${variables.id}`).then((res) => res.data);

  export const useQuery = (
    variables: Variables,
    options: Omit<UseQueryOptions<Data, Error>, "queryKey"> = {},
  ) => {
    return useRQQuery({
      ...options,
      queryKey: getQueryKey(variables),
      queryFn: () => queryFn(variables),
      enabled: Boolean(variables.id) && options.enabled !== false,
    });
  };
}