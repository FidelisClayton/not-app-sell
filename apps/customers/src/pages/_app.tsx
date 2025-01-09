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
import { ThemeProvider } from "@/components/theme-provider/theme-provider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const { appId } = useRouter().query;

  const content = <Component {...pageProps} />;

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <ChakraProvider theme={platformTheme}>
            {typeof appId === "string" ? (
              <ThemeProvider>{content}</ThemeProvider>
            ) : (
              content
            )}
          </ChakraProvider>
        </SessionProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
