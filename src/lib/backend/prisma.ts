import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  onesyncPrisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.onesyncPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.onesyncPrisma = prisma;
}
