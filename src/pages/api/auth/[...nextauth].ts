import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this logic with your authentication mechanism
        const user = { id: "1", name: "User", email: credentials?.email };
        if (
          credentials?.email === "test@test.com" &&
          credentials.password === "1234"
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login", // Custom login page
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-expect-error wip
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
