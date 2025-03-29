import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalThisTyped = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalThisTyped.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThisTyped.prisma = prisma

export { prisma }

