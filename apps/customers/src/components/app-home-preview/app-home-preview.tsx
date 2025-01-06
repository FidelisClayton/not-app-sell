import { CreateAppSchema } from "@shared/validation/app-validation";
import {
  AspectRatio,
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { z } from "zod";
import { FiCompass, FiHeart, FiHome, FiUser } from "react-icons/fi";
import { ImageUpload } from "../image-upload/image-upload";
import { GetProductsQuery } from "@/queries/get-products-query";

type AppLoginPreviewProps = {
  app: z.infer<typeof CreateAppSchema>;
  appId?: string;
  onBannerUpload?: (url: string) => void;
};

export const AppHomePreview = ({
  app,
  appId,
  onBannerUpload,
}: AppLoginPreviewProps) => {
  const productsQuery = GetProductsQuery.useQuery({ appId });
  return (
    <Grid h="full" gridTemplateRows="64px 1fr 64px" w="full">
      <HStack
        justifyContent="space-between"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        borderBottomStyle="solid"
        bgColor={`${app.colorScheme ?? "slate"}.500`}
      >
        <Box />
        {app.logoUrl && (
          <Image w="12" h="12" src={app.logoUrl} alt={app.name} />
        )}
        <Box />
      </HStack>

      <Box w="full" overflowY="auto">
        <ImageUpload
          aspectRatio={1200 / 500}
          onSuccess={({ objectUrl }) => onBannerUpload?.(objectUrl)}
          imageUrl={app.bannerUrl ?? undefined}
        />

        <Heading px="2" size="md" mt={4}>
          Exclusivo para você
        </Heading>

        {(productsQuery.data?.length ?? 0) > 0 && (
          <Box
            mt={2}
            overflowX="auto"
            display="flex"
            px="4"
            scrollSnapType="x mandatory"
            pb="4"
          >
            {productsQuery.data?.map((product) => (
              <VStack
                key={product._id}
                minW="40%"
                scrollSnapAlign="start"
                px="2"
              >
                <AspectRatio w="100%" ratio={1 / 1}>
                  <Image
                    borderRadius="md"
                    objectFit="cover"
                    src={product.coverUrl}
                  />
                </AspectRatio>
                <Text
                  w="full"
                  fontWeight="semibold"
                  fontSize="sm"
                  noOfLines={1}
                >
                  {product.name}
                </Text>
              </VStack>
            ))}
          </Box>
        )}
      </Box>

      <HStack
        bgColor="white"
        borderTopStyle="solid"
        borderTopWidth="1px"
        borderTopColor="gray.100"
        justifyContent="center"
        spacing={4}
      >
        <Button
          h="full"
          variant="ghost"
          flexDirection="column"
          leftIcon={<FiHome />}
          colorScheme={app.colorScheme ?? "slate"}
          justifyContent="center"
          alignItems="center"
          iconSpacing={0}
          gap={1}
          fontSize="xl"
        ></Button>

        <Button
          h="full"
          variant="ghost"
          flexDirection="column"
          leftIcon={<FiCompass />}
          colorScheme={"slate"}
          fontSize="xl"
          justifyContent="center"
          alignItems="center"
          iconSpacing={0}
          gap={1}
        ></Button>

        <Button
          h="full"
          variant="ghost"
          flexDirection="column"
          leftIcon={<FiHeart />}
          colorScheme={"slate"}
          fontSize="xl"
          justifyContent="center"
          alignItems="center"
          iconSpacing={0}
          gap={1}
        ></Button>

        <Button
          h="full"
          variant="ghost"
          flexDirection="column"
          leftIcon={<FiUser />}
          colorScheme={"slate"}
          fontSize="xl"
          justifyContent="center"
          alignItems="center"
          iconSpacing={0}
          gap={1}
        ></Button>
      </HStack>
    </Grid>
  );
};
