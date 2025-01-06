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
} from "@chakra-ui/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/apps", // Redirect after login
      basePath: `/api/auth`,
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
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
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
              <FormLabel>Password</FormLabel>
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
              Sign In
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
