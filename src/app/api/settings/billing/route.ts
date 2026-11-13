import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import { apiHandler, assertBackendEnabled } from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const [accounts, members, sessions, invoices] = await Promise.all([
      prisma.channelAccount.count({ where: { workspaceId: DEMO_WORKSPACE_ID } }),
      prisma.teamMember.count({ where: { workspaceId: DEMO_WORKSPACE_ID, status: "ACTIVE" } }),
      prisma.liveSession.count({ where: { workspaceId: DEMO_WORKSPACE_ID } }),
      prisma.invoice.findMany({
        where: { workspaceId: DEMO_WORKSPACE_ID },
        orderBy: { invoiceDate: "desc" },
        take: 50,
      }),
    ]);
    return Response.json({
      data: {
        plan: {
          name: "Starter",
          monthlyPrice: 499,
          connectedAccounts: { used: accounts, limit: 5 },
          teamMembers: { used: members, limit: 5 },
          liveSessions: { used: sessions, limit: 10 },
        },
        invoices: invoices.map((invoice) => ({
          ...invoice,
          invoiceDate: invoice.invoiceDate.toISOString(),
        })),
      },
    });
  });
}
