import { GetPageQuery } from "@/queries/get-page-query";
import { GetPagesQuery } from "@/queries/get-pages-query";
import { GetProductProgressQuery } from "@/queries/get-product-progress-query";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Product } from "@shared/models/product-model";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FiBookOpen } from "react-icons/fi";

export type LatestProductProps = {
  product: Product;
};

export const LatestProduct = ({ product }: LatestProductProps) => {
  const router = useRouter();

  const progressQuery = GetProductProgressQuery.useQuery({
    productId: product._id,
  });
  const pagesQuery = GetPagesQuery.useQuery({ productId: product._id });

  const progresses = progressQuery.data ?? [];
  const lastPage = progresses[progresses.length - 1];

  const lastPageQuery = GetPageQuery.useQuery({
    pageId: lastPage?.page,
  });

  const handleContinue = () => {
    const nextPageId = pagesQuery.data?.find((page) => {
      return !progressQuery.data?.some((pp) => pp.page === page._id);
    })?._id;

    if (nextPageId) {
      router.push(
        `${router.asPath}/products/${product._id}/pages/${nextPageId}`,
      );
    } else {
      router.push(
        `${router.asPath}/products/${product._id}/pages/${pagesQuery.data?.[0]?._id}`,
      );
    }
  };

  const progressPct = useMemo(() => {
    if (!progressQuery.data || !pagesQuery.data) return 0;

    return (
      progressQuery.data.filter((progress) => progress.isCompleted).length /
      pagesQuery.data.length
    );
  }, [progressQuery, pagesQuery]);

  return (
    <VStack
      bgColor="white"
      borderRadius="lg"
      p={4}
      alignItems="stretch"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="slate.100"
    >
      <HStack w="full" justifyContent="space-between" alignItems="flex-start">
        <Badge size="sm" display="flex" alignItems="center" gap={2} py="1">
          <Box>
            <FiBookOpen />
          </Box>
          {lastPageQuery.data && (
            <Text fontSize="2xs">Módulo {lastPageQuery.data.index + 1}</Text>
          )}
        </Badge>

        <AspectRatio w="20" ratio={1 / 1}>
          <Image
            borderRadius="lg"
            objectFit="cover"
            src="https://appify-dev.s3.amazonaws.com/clayton.fidelis%40live.com/676ebd54d7c1d9136330cb66_Leonardo_Phoenix_10_Cartoonstyle_illustration_in_169_aspect_ra_0.jpg"
          />
        </AspectRatio>
      </HStack>

      <VStack alignItems="stretch" spacing={0}>
        <Text fontWeight="semibold" fontSize="sm">
          {product.name}
        </Text>
        {product.description && (
          <Text fontSize="xs" color="slate.600">
            {product.description}
          </Text>
        )}
      </VStack>

      <Button
        w="full"
        fontSize="sm"
        fontWeight="semibold"
        onClick={handleContinue}
      >
        Continuar
      </Button>

      <Progress w="full" h={1} borderRadius="md" value={progressPct * 100} />
    </VStack>
  );
};
