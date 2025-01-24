import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string
      email: string
      exp: string
      iat: string
      jti: string
      name: string
      picture: string
      sub: string
    }
  }
}
