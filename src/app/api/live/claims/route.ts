import { z } from "zod";
import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  ApiError,
  assertBackendEnabled,
  parseJson,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";
import { createClaimSchema } from "../../../../lib/backend/schemas";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const sessions = await prisma.liveSession.findMany({
      where: { workspaceId: DEMO_WORKSPACE_ID },
      orderBy: { startedAt: "desc" },
      take: 20,
      include: { claims: { orderBy: { createdAt: "desc" }, take: 500 } },
    });
    const activeSession = sessions.find((session) => session.status === "LIVE") ?? sessions[0];
    return Response.json({
      data: {
        sessions: sessions.map(({ claims, ...session }) => ({
          ...session,
          startedAt: session.startedAt?.toISOString() ?? null,
          endedAt: session.endedAt?.toISOString() ?? null,
          claimsCount: claims.length,
        })),
        activeSession: activeSession
          ? {
              ...activeSession,
              startedAt: activeSession.startedAt?.toISOString() ?? null,
              endedAt: activeSession.endedAt?.toISOString() ?? null,
              claims: activeSession.claims.map((claim) => ({
                ...claim,
                createdAt: claim.createdAt.toISOString(),
              })),
            }
          : null,
      },
    });
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const input = await parseJson(request, createClaimSchema.extend({
      sessionId: z.string().min(1).optional(),
    }).strict());
    const session = input.sessionId
      ? await prisma.liveSession.findFirst({
          where: { id: input.sessionId, workspaceId: DEMO_WORKSPACE_ID },
          select: { id: true },
        })
      : await prisma.liveSession.findFirst({
          where: { workspaceId: DEMO_WORKSPACE_ID, status: "LIVE" },
          orderBy: { startedAt: "desc" },
          select: { id: true },
        });
    if (!session) throw new ApiError(409, "There is no active live session for this claim.", "NO_ACTIVE_SESSION");

    const claim = await prisma.liveClaim.create({
      data: {
        sessionId: session.id,
        customerName: input.customerName,
        customerHandle: input.customerHandle,
        productName: input.productName,
        variant: input.variant,
        quantity: input.quantity,
        comment: input.comment,
        status: input.status,
      },
    });
    return Response.json({ data: claim }, { status: 201 });
  });
}
