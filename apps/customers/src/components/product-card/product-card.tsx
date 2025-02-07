import { GetPagesQuery } from "@/queries/get-pages-query";
import { GetProductProgressQuery } from "@/queries/get-product-progress-query";
import {
  AspectRatio,
  Box,
  Center,
  Image,
  Progress,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Product } from "@shared/models/product-model";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { FaLock } from "react-icons/fa";

export type ProductCardProps = {
  product: Product;
  isActive: boolean;
};

export const ProductCard = ({ product, isActive }: ProductCardProps) => {
  const pagesQuery = GetPagesQuery.useQuery(
    { productId: product._id },
    { enabled: isActive },
  );
  const progressQuery = GetProductProgressQuery.useQuery(
    {
      productId: product._id,
    },
    { enabled: isActive },
  );

  const progressPct = useMemo(() => {
    if (!pagesQuery.data || !progressQuery.data) {
      return 0;
    }

    return (
      progressQuery.data.filter((p) => p.isCompleted).length /
      pagesQuery.data.length
    );
  }, [pagesQuery.data, progressQuery.data]);

  const router = useRouter();
  return (
    <VStack
      bgColor="white"
      p="2"
      as={Link}
      href={`${router.asPath}/products/${product._id}`}
      key={product._id}
      scrollSnapAlign="start"
      borderRadius="lg"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="slate.100"
    >
      <AspectRatio w="full" ratio={1 / 1}>
        <Center w="full" objectFit="cover">
          <Image
            w="full"
            h="full"
            borderRadius="md"
            objectFit="cover"
            src={product.coverUrl}
            filter={isActive ? undefined : "grayscale(80%)"}
          />
          {!isActive && (
            <Center
              position="absolute"
              color="white"
              fontSize="xl"
              bgColor="blackAlpha.500"
              w="full"
              h="full"
            >
              <FaLock />
            </Center>
          )}
        </Center>
      </AspectRatio>
      <Text
        textAlign="center"
        w="full"
        fontWeight="semibold"
        fontSize="xs"
        noOfLines={2}
      >
        {product.name}
      </Text>

      <Spacer />

      <Progress h={1} w="full" borderRadius="md" value={progressPct * 100} />
    </VStack>
  );
};
