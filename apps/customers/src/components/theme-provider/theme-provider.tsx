import { GetAppQuery } from "@/queries/get-app-query";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { colorsTheme } from "@shared/lib/theme";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { appId } = useRouter().query;

  const appQuery = GetAppQuery.useQuery({ id: appId?.toString() });
  const app = appQuery.data;
  const propsWithColorScheme = {
    defaultProps: {
      colorScheme: "brand",
    },
  };

  return (
    <ChakraProvider
      theme={extendTheme(colorsTheme, {
        colors: {
          brand: colorsTheme.colors[app?.colorScheme ?? "brand"],
        },
        components: {
          Input: propsWithColorScheme,
          Button: propsWithColorScheme,
          IconButton: propsWithColorScheme,
          Link: propsWithColorScheme,
          Progress: propsWithColorScheme,
        },
      })}
    >
      {children}
    </ChakraProvider>
  );
};
