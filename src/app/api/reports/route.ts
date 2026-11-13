import { DEMO_WORKSPACE_ID } from "../../../lib/backend/constants";
import { apiHandler, assertBackendEnabled } from "../../../lib/backend/http";
import { prisma } from "../../../lib/backend/prisma";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const since = new Date(Date.now() - 7 * 86_400_000);
    const [
      messages,
      unanswered,
      orders,
      claims,
      team,
      platforms,
      liveSession,
    ] = await Promise.all([
      prisma.message.count({ where: { conversation: { workspaceId: DEMO_WORKSPACE_ID }, createdAt: { gte: since } } }),
      prisma.conversation.count({ where: { workspaceId: DEMO_WORKSPACE_ID, needsReply: true } }),
      prisma.order.count({ where: { workspaceId: DEMO_WORKSPACE_ID, createdAt: { gte: since } } }),
      prisma.liveClaim.count({ where: { session: { workspaceId: DEMO_WORKSPACE_ID }, createdAt: { gte: since } } }),
      prisma.teamMember.findMany({
        where: { workspaceId: DEMO_WORKSPACE_ID, status: "ACTIVE" },
        include: {
          _count: { select: { conversations: true } },
          conversations: {
            where: { workspaceId: DEMO_WORKSPACE_ID },
            select: { id: true, status: true },
          },
        },
      }),
      prisma.channelAccount.findMany({
        where: { workspaceId: DEMO_WORKSPACE_ID },
        include: {
          _count: {
            select: {
              conversations: { where: { createdAt: { gte: since } } },
            },
          },
        },
      }),
      prisma.liveSession.findFirst({
        where: { workspaceId: DEMO_WORKSPACE_ID },
        orderBy: { startedAt: "desc" },
        include: { _count: { select: { claims: true } } },
      }),
    ]);

    const totalPlatformMessages = platforms.reduce(
      (total, platform) => total + platform._count.conversations,
      0,
    );
    const messagesByPlatform = platforms.map((platform) => ({
      platform: platform.name,
      count: platform._count.conversations,
      percentage: totalPlatformMessages
        ? Math.round((platform._count.conversations / totalPlatformMessages) * 100)
        : 0,
    }));

    return Response.json({
      data: {
        period: "7d",
        metrics: {
          messages,
          unanswered,
          orders,
          liveClaims: claims,
        },
        messagesByPlatform,
        team: team.map((member) => ({
          id: member.id,
          name: member.name,
          replied: member._count.conversations,
          resolved: member.conversations.filter((conversation) => conversation.status === "RESOLVED").length,
          averageResponseMinutes: null,
        })),
        latestLiveSession: liveSession
          ? {
              id: liveSession.id,
              title: liveSession.title,
              status: liveSession.status,
              claims: liveSession._count.claims,
            }
          : null,
      },
    });
  });
}
