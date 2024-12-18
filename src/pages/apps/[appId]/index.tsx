import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  FormControl,
  FormLabel,
  VStack,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { apps } from "@/lib/db";

export default function AppLoginPage() {
  const router = useRouter();
  const { appId } = router.query;
  const app = apps.find((app) => app.slug === appId);

  console.log("appId", appId);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: `/apps/${appId}/dashboard`, // Redirect after login
    });
  };

  if (!app) {
    return <p>Aplicativo não encontrado</p>;
  }

  return (
    <>
      <Head>
        {/* Link to tenant-specific manifest */}
        <link rel="manifest" href={`/apps/${appId}/manifest.json`} />
      </Head>

      <Box h="100vh" w="100vw" bgColor={`${app.colorScheme}.50`}>
        <Container maxW="md" pt={12} centerContent>
          <VStack w="full" spacing={8}>
            <Image src={app.logoUrl} maxW="20" />
            <Heading>{app.name}</Heading>
            <Box
              p={8}
              w="100%"
              borderWidth={1}
              borderRadius="lg"
              boxShadow="lg"
              bgColor="white"
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme={app.colorScheme}
                    size="lg"
                    fontSize="md"
                    w="100%"
                  >
                    Entrar
                  </Button>
                </Stack>
              </form>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
