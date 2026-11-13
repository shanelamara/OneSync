import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  assertBackendEnabled,
  parseJson,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";
import { savedReplySchema } from "../../../../lib/backend/schemas";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const replies = await prisma.savedReply.findMany({
      where: { workspaceId: DEMO_WORKSPACE_ID },
      orderBy: { title: "asc" },
    });
    return Response.json({
      data: replies.map((reply) => ({
        ...reply,
        createdAt: reply.createdAt.toISOString(),
        updatedAt: reply.updatedAt.toISOString(),
      })),
    });
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const input = await parseJson(request, savedReplySchema);
    const reply = await prisma.savedReply.create({
      data: { ...input, workspaceId: DEMO_WORKSPACE_ID },
    });
    return Response.json(
      {
        data: {
          ...reply,
          createdAt: reply.createdAt.toISOString(),
          updatedAt: reply.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  });
}
