import { getCsrfToken } from "next-auth/react";
import {
  Button,
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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { GetAppQuery } from "@/queries/get-app-query";
import { colorsTheme } from "@shared/lib/theme";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { connectDB } from "@shared/lib/mongodb";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { attachCookiesToHttpClient } from "@shared/lib/http";
import { LoginMutation } from "@/mutations/login-mutation";
import { match } from "ts-pattern";
import { validateSession } from "@/lib/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  attachCookiesToHttpClient(context.req.cookies);
  await connectDB();

  const csrfToken = await getCsrfToken(context);

  const { appId } = context.query;

  if (typeof appId !== "string") return {};

  try {
    const sessionUser = await validateSession(context.req, context.res);

    if (sessionUser)
      return {
        redirect: {
          destination: `/apps/${context.params?.appId}`,
          permanent: false,
        },
      };
  } catch (e) {}

  const queryClient = new QueryClient();

  await GetAppQuery.prefetchQuery(queryClient, { id: appId });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      csrfToken,
    },
  };
}

export type LoginPageProps = {
  csrfToken: string;
};

export default function LoginPage({ csrfToken }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const appId = router.query.appId?.toString();

  const appQuery = GetAppQuery.useQuery({ id: appId });
  const app = appQuery.data!;

  const loginMutation = LoginMutation.useMutation({
    onSuccess: () => {
      router.push(`/apps/${appId}/`);
    },
  });

  const errorMessage = useMemo(() => {
    const url = loginMutation.error?.response?.data?.url;

    if (!url) {
      return null;
    }

    const parsedUrl = new URL(url);
    const errorCode = parsedUrl.searchParams.get("error");

    return match(errorCode)
      .with("CredentialsSignin", () => (
        <>
          <Text fontWeight="semibold">Sua conta não foi encontrada</Text>
          <Text fontSize="sm">
            Por favor, entre em contato com o suporte do aplicativo.
          </Text>
        </>
      ))
      .otherwise(() => (
        <>
          <Text fontWeight="semibold">Não foi possível entrar</Text>
          <Text fontSize="sm">
            Se o error continuar, por favor entre em contato com o suporte do
            aplicativo.{" "}
          </Text>
        </>
      ));
  }, [loginMutation.error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email,
      appId: app._id,
      callbackUrl: `/apps/${app._id}`, // Redirect after login
      basePath: `/api/auth`,
      csrfToken,
      json: true,
    });
  };

  if (!app) return null;

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

                {errorMessage && (
                  <Alert
                    alignItems="flex-start"
                    borderRadius="lg"
                    status="error"
                  >
                    <AlertIcon />
                    <VStack w="full" alignItems="stretch" spacing={0}>
                      {errorMessage}
                    </VStack>
                  </Alert>
                )}
              </Stack>
            </VStack>
          </Stack>
        </Container>
      </ChakraProvider>
    </>
  );
}
