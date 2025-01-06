import { http } from "@shared/lib/http";
import { AppDocument } from "@shared/models/app-model";
import { UseQueryOptions, useQuery as useRQQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export namespace GetAppsQuery {
  export type Data = AppDocument[];
  export type Error = AxiosError;

  export const queryKey = ["get", "app"];

  export const getQueryKey = () => [...queryKey];

  export const queryFn = () => http.get(`/apps`).then((res) => res.data);

  export const useQuery = (
    options: Omit<UseQueryOptions<Data, Error>, "queryKey"> = {},
  ) => {
    return useRQQuery({
      ...options,
      queryKey: getQueryKey(),
      queryFn: () => queryFn(),
    });
  };
}
