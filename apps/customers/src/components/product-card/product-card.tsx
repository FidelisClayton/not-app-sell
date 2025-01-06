import {
  AspectRatio,
  Box,
  Center,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Product } from "@shared/models/product-model";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaLock } from "react-icons/fa";

export type ProductCardProps = {
  product: Product;
  isActive: boolean;
};

export const ProductCard = ({ product, isActive }: ProductCardProps) => {
  const router = useRouter();
  return (
    <VStack
      as={Link}
      href={`${router.asPath}/products/${product._id}`}
      key={product._id}
      minW="40%"
      maxW="40%"
      scrollSnapAlign="start"
      px="2"
    >
      <AspectRatio w="100%" ratio={1 / 1}>
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
      <Text w="full" fontWeight="semibold" fontSize="sm" noOfLines={1}>
        {product.name}
      </Text>
    </VStack>
  );
};
