import { GetProductsQuery } from "@/queries/get-products-query";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import { attachCookiesToHttpClient } from "@/lib/http";
import { ProductsScreen } from "@/screens/products";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  attachCookiesToHttpClient(context.req.cookies);
  const appId = context.params?.appId?.toString();
  const productId = context.params?.productId?.toString();

  const queryClient = new QueryClient();

  const products =
    (await GetProductsQuery.fetchQuery(queryClient, { appId })) ?? [];

  const redirect =
    products.length > 0
      ? {
          redirect: {
            permanent: false,
            destination: `/apps/${appId}/products/${products[0]._id}`,
          },
        }
      : {};

  return {
    props: {
      products,
      dehydratedState: dehydrate(queryClient),
    },
    ...redirect,
  };
}

export default function ProductsPage() {
  return <ProductsScreen />;
}
