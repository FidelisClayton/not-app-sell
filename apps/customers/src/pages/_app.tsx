import { platformTheme } from "@shared/lib/theme";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useState } from "react";
import { useRouter } from "next/router";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  const { appId } = useRouter().query;

  const basePath = `${process.env.NEXT_PUBLIC_ENDPOINT_URL}/apps/${appId}/splash-screen`;

  return (
    <>
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        href={`${basePath}?width=1125&height=2436`}
      />
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        href={`${basePath}?width=750&size=1334`}
      />
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
        href={`${basePath}?width=1242&height=2208`}
      />
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
        href={`${basePath}?width=640&height=1136`}
      />
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
        href={`${basePath}?width=1536&height=2048`}
      />
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
        href={`${basePath}?width=1668&height=2224`}
      />
      <link
        rel="apple-touch-startup-image"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        href={`${basePath}?width=2048&height=2732`}
      />

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <SessionProvider session={session}>
            <ChakraProvider theme={platformTheme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </SessionProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}
