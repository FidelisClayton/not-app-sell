import { GetAppQuery } from "@/queries/get-app-query";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Spacer,
  StackProps,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiChevronLeft, FiLogOut } from "react-icons/fi";

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
      alignItems="center"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      borderBottomStyle="solid"
      bgColor="white"
      w="full"
      {...props}
    >
      {backLink ? (
        <Flex justifyContent="flex-start" flex="1">
          <IconButton
            aria-label="Voltar"
            variant="unstyled"
            colorScheme="slate"
            alignItems="center"
            justifyContent="center"
            as={Link}
            href={backLink}
            icon={<FiChevronLeft />}
            fontSize="2xl"
            display="flex"
          />
        </Flex>
      ) : (
        <Spacer />
      )}
      {appQuery.data.logoUrl && (
        <Flex justifyContent="center" alignItems="center" flex="1">
          <Image h="12" src={appQuery.data.logoUrl} alt={appQuery.data.name} />
        </Flex>
      )}
      <Flex justifyContent="flex-end" flex="1">
        <IconButton
          aria-label="Voltar"
          variant="ghost"
          colorScheme="slate"
          onClick={() => {
            signOut({
              callbackUrl: `/apps/${appId}/login`,
            });
          }}
          icon={
            <Box fontSize="lg">
              <FiLogOut />
            </Box>
          }
        />
      </Flex>
    </HStack>
  );
};
