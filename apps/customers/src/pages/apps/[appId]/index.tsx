import { Box, Container, Grid, Heading, Image } from "@chakra-ui/react";
import { GetProductsQuery } from "@/queries/get-products-query";
import { useRouter } from "next/router";
import { GetAppQuery } from "@/queries/get-app-query";
import { ProductCard } from "@/components/product-card";
import { TopMenu } from "@/components/top-menu";
import { GetLatestProductQuery } from "@/queries/get-latest-products-query";
import { LatestProduct } from "@/components/latest-product";
import Head from "next/head";
import { validateSession } from "@/lib/auth";
import { GetServerSidePropsContext } from "next";

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   try {
//     const sessionUser = await validateSession(context.req, context.res);
//     if (!sessionUser)
//       return {
//         redirect: {
//           destination: `/apps/${context.params?.appId}/login`,
//           permanent: false,
//         },
//       };
//
//     return { props: {} };
//   } catch (e) {
//     return {
//       redirect: {
//         destination: `/apps/${context.params?.appId}/login`,
//         permanent: false,
//       },
//     };
//   }
// }

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

  if (!appQuery.data || !ownedProductsQuery.data) return null;

  return (
    <>
      <Head>
        {/* Link to tenant-specific manifest */}
        <link rel="manifest" href={`/api/apps/${appId}/manifest.json`} />
      </Head>

      <Grid h="100vh" gridTemplateRows="64px 1fr 64px" w="full">
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
              <Box
                mt={2}
                overflowX="auto"
                display="flex"
                scrollSnapType="x mandatory"
                pb="4"
                gap="2"
              >
                {ownedProductsQuery.data?.map((product) => (
                  <ProductCard key={product._id} product={product} isActive />
                ))}
              </Box>
            </>
          )}

          {(unownedProductsQuery.data?.length ?? 0) > 0 && (
            <>
              <Heading px="2" size="md" mt={4}>
                Conheça também
              </Heading>
              <Box
                mt={2}
                overflowX="auto"
                display="flex"
                scrollSnapType="x mandatory"
                pb="4"
              >
                {unownedProductsQuery.data?.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isActive={false}
                  />
                ))}
              </Box>
            </>
          )}
        </Container>

        {/* <BottomMenu /> */}
      </Grid>
    </>
  );
}
