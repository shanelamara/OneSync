import { apiHandler, assertBackendEnabled } from "../../../lib/backend/http";
import { prisma } from "../../../lib/backend/prisma";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", database: "connected" });
  });
}
