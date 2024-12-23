import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT_URL,
});

export const attachCookiesToHttpClient = (
  cookies: Partial<Record<string, string>>,
) => {
  http.interceptors.request.use(
    (config) => {
      // Attach cookies to the request headers
      if (cookies) {
        config.headers.Cookie = Object.entries(cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join("; ");
      }
      return config;
    },
    (error) => {
      // Handle the request error
      return Promise.reject(error);
    },
  );
};
