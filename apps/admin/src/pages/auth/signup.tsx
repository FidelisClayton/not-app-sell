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
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { SignupMutation } from "@/mutations/signup-mutation";
import { useRouter } from "next/router";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useToast();

  const signupMutation = SignupMutation.useMutation({
    onSuccess: () => {
      router.push("/auth/login");
    },
    onError: () => {
      toast({
        status: "error",
        description: "E-mail já está cadastrado",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    signupMutation.mutate({
      name,
      email,
      password,
    });
  };

  return (
    <Container maxW="md" centerContent>
      <Box
        p={8}
        mt={12}
        w="100%"
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading mb={6} textAlign="center">
          Criar conta
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              fontSize="md"
              w="100%"
            >
              Cadastrar
            </Button>
          </Stack>
        </form>
        <Text mt={4} textAlign="center">
          Or sign in with:
        </Text>
        <Center>
          <Button
            mt={2}
            colorScheme="red"
            w="100%"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Google
          </Button>
        </Center>
      </Box>
    </Container>
  );
}
