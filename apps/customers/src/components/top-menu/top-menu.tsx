import { GetAppQuery } from "@/queries/get-app-query";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  StackProps,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiChevronLeft } from "react-icons/fi";

export type TopMenuProps = StackProps & {
  backLink?: string;
};

export const TopMenu = ({ backLink, ...props }: TopMenuProps) => {
  const router = useRouter();
  const appId = router.query.appId as string;
  const appQuery = GetAppQuery.useQuery({ id: appId });

  if (!appQuery.data) return null;

  return (
    <HStack
      position="sticky"
      top="0"
      zIndex="10"
      justifyContent="space-between"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      borderBottomStyle="solid"
      bgColor={`${appQuery.data.colorScheme ?? "slate"}.500`}
      w="full"
      {...props}
    >
      {backLink ? (
        <IconButton
          aria-label="Voltar"
          variant="ghost"
          colorScheme="green"
          color="white"
          as={Link}
          href={backLink}
          icon={
            <Box fontSize="2xl">
              <FiChevronLeft />
            </Box>
          }
        />
      ) : (
        <Box />
      )}
      {appQuery.data.logoUrl && (
        <Image
          w="12"
          h="12"
          src={appQuery.data.logoUrl}
          alt={appQuery.data.name}
        />
      )}
      <Box />
    </HStack>
  );
};
