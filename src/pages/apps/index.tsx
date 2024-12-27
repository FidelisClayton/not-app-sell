import { GetAppsQuery } from "@/queries/get-apps-query";
import {
  Box,
  Button,
  Container,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

export default function AppsPage() {
  const session = useSession();
  const appsQuery = GetAppsQuery.useQuery();
  return (
    <>
      <Head>
        <title>Apps | SofistApps</title>
      </Head>

      <Box
        w="full"
        bgColor="white"
        borderBottomWidth="1px"
        borderBottomColor="slate.200"
        borderBottomStyle="solid"
      >
        <Container maxW="6xl">
          <HStack justifyContent="space-between" px="4" py="4">
            <Text fontSize="xl" fontWeight="semibold">
              Logo
            </Text>

            <Menu>
              <MenuButton
                as={Button}
                fontWeight="normal"
                colorScheme="slate"
                variant="ghost"
                rightIcon={
                  <Box color="gray.400">
                    <FaChevronDown />
                  </Box>
                }
              >
                <VStack alignItems="stretch" spacing="-1">
                  <Text textAlign="left" fontSize="sm">
                    Olá <strong>{session.data?.user?.name}</strong>
                  </Text>
                  <Text textAlign="left" fontSize="sm">
                    {session.data?.user?.email}
                  </Text>
                </VStack>
              </MenuButton>

              <MenuList>
                <MenuItem>Sair</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Container>
      </Box>

      <Box
        w="full"
        bgColor="white"
        borderBottomWidth="1px"
        borderBottomColor="slate.200"
        borderBottomStyle="solid"
      >
        <Container maxW="6xl">
          <HStack justifyContent="space-between" px="4" py="4">
            <Text fontSize="xl" fontWeight="semibold">
              Dashboard
            </Text>

            <Button
              as={Link}
              href="/apps/new"
              colorScheme="slate"
              bgColor="slate.900"
              _hover={{ bgColor: "slate.950" }}
            >
              Criar App
            </Button>
          </HStack>
        </Container>
      </Box>

      <Container maxW="6xl" w="full" py="4" mx="auto">
        <VStack w="full" alignItems="stretch" px="4">
          <SimpleGrid gridTemplateColumns="1fr 1fr 1fr" gap={4}>
            {appsQuery.data?.map((app) => (
              <HStack
                key={app._id}
                as={Link}
                spacing={3}
                bgColor="white"
                borderRadius="lg"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="slate.200"
                p="4"
                cursor="pointer"
                href={`/apps/${app._id}`}
                _hover={{ borderColor: "slate.950" }}
              >
                {app.logoUrl && (
                  <Image maxW="16" alt={app.name} src={app.logoUrl} />
                )}

                <VStack w="full" alignItems="stretch" spacing={0}>
                  <Text color="gray.800">{app.name}</Text>
                  <Text color="gray.500" mt="-1">
                    {app.description}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </>
  );
}
