import {
  UseMutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { http } from "@shared/lib/http";
import { AxiosError } from "axios";

export namespace CompletePageMutation {
  export type Variables = { pageId: string };
  export type Data = void;
  export type Error = AxiosError;

  export const mutationKey = ["complete", "page"];

  const mutationFn = ({ pageId }: Variables) =>
    http.post(`/pages/${pageId}/complete`).then((res) => res.data);

  export const useMutation = (
    options: UseMutationOptions<Data, Error, Variables> = {},
  ) => {
    return useRQMutation({
      ...options,
      mutationKey,
      mutationFn,
    });
  };
}
