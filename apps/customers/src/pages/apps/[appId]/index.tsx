import { Box, Container, Grid, Heading, Image } from "@chakra-ui/react";
import { GetProductsQuery } from "@/queries/get-products-query";
import { useRouter } from "next/router";
import { GetAppQuery } from "@/queries/get-app-query";
import { ProductCard } from "@/components/product-card";
import { TopMenu } from "@/components/top-menu";
import { GetLatestProductQuery } from "@/queries/get-latest-products-query";
import { LatestProduct } from "@/components/latest-product";
import { validateSession } from "@/lib/auth";
import { GetServerSidePropsContext } from "next";
import { PWAHead } from "@/components/pwa-head";
import { attachCookiesToHttpClient } from "@shared/lib/http";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  attachCookiesToHttpClient(context.req.cookies);
  const { appId } = context.query;

  if (typeof appId !== "string") return {};

  try {
    const sessionUser = await validateSession(context.req, context.res);
    if (!sessionUser)
      return {
        redirect: {
          destination: `/apps/${context.params?.appId}/login`,
          permanent: false,
        },
      };

    const queryClient = new QueryClient();

    await GetAppQuery.prefetchQuery(queryClient, { id: appId });

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (e) {
    return {
      redirect: {
        destination: `/apps/${context.params?.appId}/login`,
        permanent: false,
      },
    };
  }
}

export default function AppHomePreview() {
  const router = useRouter();
  const appId = router.query.appId as string;

  const latestProductQuery = GetLatestProductQuery.useQuery();

  const appQuery = GetAppQuery.useQuery({ id: appId });
  const ownedProductsQuery = GetProductsQuery.useQuery({
    appId,
    subscriptionStatus: "Active",
  });
  const unownedProductsQuery = GetProductsQuery.useQuery({
    appId,
    subscriptionStatus: "Inactive",
  });

  if (!appQuery.data) return null;

  return (
    <>
      <PWAHead app={appQuery.data} />
      <ThemeProvider>
        <Grid h="100vh" gridTemplateRows="64px 1fr" w="full">
          <TopMenu />

          <Container maxW="sm" w="full" overflowY="auto">
            {appQuery.data.bannerUrl && (
              <Image mb="4" w="full" src={appQuery.data.bannerUrl} />
            )}

            {latestProductQuery.data && (
              <LatestProduct product={latestProductQuery.data} />
            )}

            {(ownedProductsQuery.data?.length ?? 0) > 0 && (
              <>
                <Heading px="2" size="md" mt={4}>
                  Exclusivo para você
                </Heading>
                <Grid gridTemplateColumns="1fr 1fr" mt={2} pb="4" gap="2">
                  {ownedProductsQuery.data?.map((product) => (
                    <ProductCard key={product._id} product={product} isActive />
                  ))}
                </Grid>
              </>
            )}

            {(unownedProductsQuery.data?.length ?? 0) > 0 && (
              <>
                <Heading px="2" size="md" mt={4}>
                  Conheça também
                </Heading>
                <Grid gridTemplateColumns="1fr 1fr" mt={2} pb="4" gap="2">
                  {unownedProductsQuery.data?.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      isActive={false}
                    />
                  ))}
                </Grid>
              </>
            )}
          </Container>

          {/* <BottomMenu /> */}
        </Grid>
      </ThemeProvider>
    </>
  );
}
