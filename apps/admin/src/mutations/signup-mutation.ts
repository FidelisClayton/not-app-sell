import { AxiosError } from "axios";
import {
  MutationOptions,
  useMutation as useRQMutation,
} from "@tanstack/react-query";
import { http } from "@shared/lib/http";

export namespace SignupMutation {
  export type Params = { name: string; email: string; password: string };
  export type Response = void;
  export type Error = AxiosError;

  export const key = ["signup"];

  export const mutationFn = (params: Params) =>
    http.post("/auth/signup", params).then((res) => res.data);

  export const useMutation = (
    options: MutationOptions<Response, Error, Params> = {},
  ) => {
    return useRQMutation({
      mutationKey: key,
      mutationFn,
      ...options,
    });
  };
}
