import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { stripSslMode } from "./db-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: stripSslMode(process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL),
  // Supabase's pooler presents a cert the Node `pg` driver can't always
  // fully verify; this matches Supabase's own connection guidance.
  ssl: { rejectUnauthorized: false },
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
