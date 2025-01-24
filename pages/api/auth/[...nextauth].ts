import { socialLogin, login } from '@utils/auth';
import NextAuth, { NextAuthOptions } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { useUserStore } from '@utils/store';


// console.log('FACEBOOK_ID', process.env.FACEBOOK_ID);
// console.log('REACT_APP_FACEBOOK_ID', process.env.REACT_APP_FACEBOOK_ID);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || '',
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const response = await login({ email, password });
        if (response) {
          return response;
        }

        return null;
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: 'select_account', // Forces account selection
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // const authStoreToken = useUserStore.getState().Token;

      if (account && user) {
        if (account.provider === 'facebook' || account.provider === 'google') {
          const response = await socialLogin({
            provider: account.provider,
            id: user?.id,
            name: user?.name,
            email: user?.email,
            image: user?.image,
            // existingToken: authStoreToken, // This might be undefined
          });
          token.accessToken = response.token;
        }

        if (user && account.type === 'credentials') {
          token.accessToken = user;
        }

      } 
      // else {
        // token.accessToken = '';
        // useUserStore.getState().SetToken('');
        // useUserStore.getState().SetFirstName('');
        // useUserStore.getState().SetLastName('');
        // useUserStore.getState().SetEmail('');
      // }
      // } else {
      //   useUserStore.getState().SetToken('');
      // }

      return token;
    },

    async session({ session, token }) {
      session.user = token as any;

      // useUserStore.getState().SetToken(token.accessToken as any);
      return session;
    },
  },
  events: {
    async signOut() {
      // useUserStore.getState().SetToken('');
      // useUserStore.getState().SetFirstName('');
      // useUserStore.getState().SetLastName('');
      // useUserStore.getState().SetEmail('');
      // useUserStore.getState().SetToken('');
    },
  },
};

export default NextAuth(authOptions);
