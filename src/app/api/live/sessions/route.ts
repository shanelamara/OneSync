import { z } from "zod";
import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  assertBackendEnabled,
  parseJson,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";

const createSessionSchema = z.object({
  title: z.string().trim().min(1).max(120),
  keywords: z.array(z.string().trim().min(1).max(40)).max(30).default(["mine", "steal"]),
}).strict();

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const sessions = await prisma.liveSession.findMany({
      where: { workspaceId: DEMO_WORKSPACE_ID },
      orderBy: { startedAt: "desc" },
      take: 100,
      include: { _count: { select: { claims: true } } },
    });
    return Response.json({
      data: sessions.map((session) => ({
        ...session,
        keywords: session.keywords.split(",").filter(Boolean),
        startedAt: session.startedAt?.toISOString() ?? null,
        endedAt: session.endedAt?.toISOString() ?? null,
        claimsCount: session._count.claims,
      })),
    });
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const input = await parseJson(request, createSessionSchema);
    const session = await prisma.liveSession.create({
      data: {
        workspaceId: DEMO_WORKSPACE_ID,
        title: input.title,
        keywords: input.keywords.join(","),
        status: "READY",
      },
    });
    return Response.json(
      { data: { ...session, keywords: input.keywords } },
      { status: 201 },
    );
  });
}
