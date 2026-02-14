import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Lazy import of prisma to avoid build issues
let prisma: any = null
async function getPrisma() {
  if (!prisma) {
    const { prisma: p } = await import("@/lib/prisma")
    prisma = p
  }
  return prisma
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        try {
          const p = await getPrisma()
          const user = await p.user.findUnique({
            where: { email: credentials.email },
            include: { subscription: true }
          })

          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!passwordMatch) {
            throw new Error("Invalid credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw new Error("Authentication failed")
        }
      }
    })
  ],

  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  },

  session: {
    strategy: "jwt"
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-build",
}
