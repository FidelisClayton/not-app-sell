import { attachCookiesToHttpClient } from "@/lib/http";
import { GetPagesQuery } from "@/queries/get-pages-query";
import { GetProductQuery } from "@/queries/get-product-query";
import { GetProductsQuery } from "@/queries/get-products-query";
import { ProductsScreen } from "@/screens/products";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  attachCookiesToHttpClient(context.req.cookies);
  const appId = context.params?.appId?.toString();
  const productId = context.params?.productId?.toString();

  const queryClient = new QueryClient();

  await GetProductsQuery.fetchQuery(queryClient, { appId });
  await GetProductQuery.fetchQuery(queryClient, { appId, productId });
  await GetPagesQuery.fetchQuery(queryClient, { appId, productId });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default function ProductPage() {
  return <ProductsScreen />;
}
