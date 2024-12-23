import { useRouter } from "next/router";
import Head from "next/head";
import {
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { apps } from "@/lib/db";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const router = useRouter();
  const { appId } = router.query;
  const app = apps.find((app) => app.slug === appId);

  if (!app) return null;

  return (
    <>
      <Head>
        {/* Link to tenant-specific manifest */}
        <link rel="manifest" href={`/api/apps/${appId}/manifest.json`} />
      </Head>
      <VStack w="full" as="main" spacing={0}>
        <HStack
          w="full"
          justifyContent="space-between"
          px={6}
          py={2}
          backgroundColor={`${app.colorScheme}.500`}
        >
          <HStack spacing={2}>
            <Image w="10" src={app.logoUrl} />
            <Text fontSize="lg" fontWeight="medium" color="white">
              {app.name}
            </Text>
          </HStack>

          <Button
            colorScheme={app.colorScheme}
            onClick={() =>
              signOut({
                redirect: true,
                callbackUrl: `/apps/${appId}`,
              })
            }
          >
            Sair
          </Button>
        </HStack>
        <Image src={app?.bannerUrl} />

        <Container maxW="5xl" mx="auto" px="2" mt={{ base: 4, md: 12 }}>
          <Heading>Produtos</Heading>
          <Grid
            mt={4}
            gap={4}
            gridTemplateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr" }}
          >
            {app.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        </Container>
      </VStack>
    </>
  );
}

type ProductCardProps = {
  product: { id: string; name: string; coverUrl: string };
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <VStack cursor="pointer" alignItems="center">
      <Image src={product.coverUrl} />
      <Text textAlign="center">{product.name}</Text>
    </VStack>
  );
};
