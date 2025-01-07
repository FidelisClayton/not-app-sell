import { TopMenu } from "@/components/top-menu";
import { GetPagesQuery } from "@/queries/get-pages-query";
import { GetProductProgressQuery } from "@/queries/get-product-progress-query";
import { GetProductQuery } from "@/queries/get-product-query";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Grid,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Page } from "@shared/models/page-model";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FiBook,
  FiBookOpen,
  FiCheck,
  FiChevronRight,
  FiLock,
} from "react-icons/fi";
import { match } from "ts-pattern";

export const ProductScreen = () => {
  const router = useRouter();

  const { productId, appId } = useRouter().query;
  const productQuery = GetProductQuery.useQuery({
    productId: productId?.toString(),
  });
  const pagesQuery = GetPagesQuery.useQuery({
    productId: productId?.toString(),
  });
  const productProgressQuery = GetProductProgressQuery.useQuery({
    productId: productId?.toString(),
  });

  const handleContinue = () => {
    const nextPageId = pagesQuery.data?.find((page) => {
      return !productProgressQuery.data?.some((pp) => pp.page === page._id);
    })?._id;

    if (nextPageId) {
      router.push(`${router.asPath}/pages/${nextPageId}`);
    } else {
      router.push(`${router.asPath}/pages/${pagesQuery.data?.[0]?._id}`);
    }
  };

  if (!productQuery.data || !pagesQuery.data) return null;

  return (
    <Grid h="100vh" gridTemplateRows="64px 1fr" w="full" gap={0}>
      <TopMenu backLink={`/apps/${appId}`} />

      <Box>
        {productQuery.data.coverUrl && (
          <AspectRatio w="full" ratio={16 / 9}>
            <Image
              alt={productQuery.data.name}
              src={productQuery.data.coverUrl}
            />
          </AspectRatio>
        )}
        <Container
          as={VStack}
          alignItems="flex-start"
          w="full"
          maxW="lg"
          py="4"
          pb="24"
        >
          <Text fontSize="xl" fontWeight="semibold">
            {productQuery.data.name}
          </Text>

          <HStack
            color="green.800"
            fontWeight="semibold"
            fontSize="sm"
            borderRadius="md"
            bgColor="green.100"
            px="2"
            py="1"
          >
            <Box>
              <FiBookOpen />
            </Box>

            <Text fontSize="xs">7 módulos</Text>
          </HStack>

          <Text>{productQuery.data.description}</Text>

          <VStack
            mt="4"
            w="full"
            borderRadius="2xl"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="slate.200"
            bgColor="white"
          >
            {pagesQuery.data.map((page) => {
              const isCompleted =
                productProgressQuery.data?.some(
                  (progress) => progress.page === page._id,
                ) ?? false;
              return (
                <PageItem
                  key={page._id}
                  page={page}
                  isCompleted={isCompleted}
                />
              );
            })}
          </VStack>

          <Box position="fixed" w="full" px="4" left="0" bottom="4">
            <Button
              w="full"
              borderRadius="3xl"
              size="lg"
              colorScheme="green"
              fontSize="sm"
              onClick={handleContinue}
            >
              Continuar
            </Button>
          </Box>
        </Container>
      </Box>
    </Grid>
  );
};

export type PageItemProps = {
  isCompleted?: boolean;
  isLocked?: boolean;
  page: Page;
};

const PageItem = ({ isCompleted, isLocked, page }: PageItemProps) => {
  const router = useRouter();
  return (
    <HStack
      as={Link}
      href={`${router.asPath}/pages/${page._id}`}
      spacing={4}
      w="full"
      _notLast={{
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "slate.200",
      }}
      py="4"
      px="4"
    >
      <Box
        w="10"
        h="10"
        borderWidth="2px"
        borderStyle={isCompleted ? "solid" : "dashed"}
        borderColor={isCompleted ? "green.500" : "slate.400"}
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          w="8"
          h="8"
          bgColor={isCompleted ? "green.500" : "slate.50"}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={isCompleted ? "green.50" : "slate.400"}
        >
          <FiBook />
        </Box>
      </Box>

      <VStack flex="1" alignItems="stretch" spacing={0}>
        <Text fontSize="sm" color="slate.500">
          Módulo
        </Text>
        <Text fontSize="md">{page.name}</Text>
      </VStack>

      <Box color="slate.600">
        {match({ isLocked, isCompleted })
          .with({ isLocked: true }, () => (
            <VStack spacing={1} mt={3} alignItems="flex-end">
              <FiLock />
              <Text fontSize="2xs">Disponível em 7h 15min</Text>
            </VStack>
          ))
          .with({ isCompleted: true }, () => (
            <Box color="green.600">
              <FiCheck />
            </Box>
          ))
          .otherwise(() => (
            <FiChevronRight />
          ))}
      </Box>
    </HStack>
  );
};
