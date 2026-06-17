let prismaClient: unknown;

export async function getPrismaClient() {
  if (process.env.SKIP_PRISMA === "1") {
    return null;
  }

  if (prismaClient) {
    return prismaClient as any;
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    prismaClient = new PrismaClient();
    return prismaClient as any;
  } catch {
    return null;
  }
}
