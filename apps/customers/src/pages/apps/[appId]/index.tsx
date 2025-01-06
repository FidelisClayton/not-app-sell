import {
  AspectRatio,
  Box,
  Button,
  Center,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiBookOpen, FiCompass, FiHome, FiUser } from "react-icons/fi";
import { GetProductsQuery } from "@/queries/get-products-query";
import { useRouter } from "next/router";
import { GetAppQuery } from "@/queries/get-app-query";
import { FaLock } from "react-icons/fa";
import { BottomMenu } from "@/components/bottom-menu";
import { ProductCard } from "@/components/product-card";
import { TopMenu } from "@/components/top-menu";

export default function AppHomePreview() {
  const router = useRouter();
  const appId = router.query.appId as string;

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
    <Grid h="100vh" gridTemplateRows="64px 1fr 64px" w="full">
      <TopMenu />

      <Box w="full" overflowY="auto">
        {appQuery.data.bannerUrl && (
          <Image w="full" src={appQuery.data.bannerUrl} />
        )}

        <Heading px="2" size="md" mt={4}>
          Exclusivo para você
        </Heading>

        {(ownedProductsQuery.data?.length ?? 0) > 0 && (
          <Box
            mt={2}
            overflowX="auto"
            display="flex"
            scrollSnapType="x mandatory"
            pb="4"
          >
            {ownedProductsQuery.data?.map((product) => (
              <ProductCard key={product._id} product={product} isActive />
            ))}
          </Box>
        )}

        <Heading px="2" size="md" mt={4}>
          Conheça também
        </Heading>

        {(unownedProductsQuery.data?.length ?? 0) > 0 && (
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
        )}
      </Box>

      <BottomMenu />
    </Grid>
  );
}
