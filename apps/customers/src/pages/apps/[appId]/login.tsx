import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  FormControl,
  FormLabel,
  ChakraProvider,
  extendTheme,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { GetAppQuery } from "@/queries/get-app-query";
import { colorsTheme } from "@shared/lib/theme";
import Head from "next/head";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const appId = router.query.appId?.toString();

  const appQuery = GetAppQuery.useQuery({ id: appId });
  const app = appQuery.data;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      appId: router.query.appId?.toString(),
      callbackUrl: `/apps/${appId}`, // Redirect after login
      basePath: `/api/auth`,
    });
  };

  if (!app) return <p>App não encontrado</p>;

  return (
    <>
      <Head>
        {/* Link to tenant-specific manifest */}
        <link rel="manifest" href={`/api/apps/${appId}/manifest.json`} />
      </Head>
      <ChakraProvider
        theme={extendTheme(colorsTheme, {
          components: {
            Input: {
              defaultProps: {
                colorScheme: app.colorScheme,
              },
            },
            Button: {
              defaultProps: {
                colorScheme: app.colorScheme,
              },
            },
            Link: {
              defaultProps: {
                colorScheme: app.colorScheme,
              },
            },
          },
        })}
      >
        <Container
          maxW="md"
          w="full"
          centerContent
          h="100vh"
          alignItems="center"
          justifyContent="center"
          px="10"
        >
          <Stack gap="4" alignItems="center" justifyContent="center" w="full">
            {app.logoUrl && <Image src={app.logoUrl} maxW="60px" />}

            <Stack w="full" gap={0} textAlign="center" mb={8}>
              <Heading size="lg">{app.name}</Heading>
              <Text color="gray.700">{app.description}</Text>
            </Stack>

            <VStack w="full" as="form" onSubmit={handleSubmit}>
              <Stack w="full" spacing={5}>
                <FormControl>
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    type="email"
                    placeholder="Digite o seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <Button type="submit" size="lg" fontSize="md" w="100%">
                  Entrar
                </Button>
              </Stack>
            </VStack>
          </Stack>
        </Container>
      </ChakraProvider>
    </>
  );
}
