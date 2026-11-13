import { z } from "zod";
import { DEMO_WORKSPACE_ID } from "../../../../../lib/backend/constants";
import {
  apiHandler,
  ApiError,
  assertBackendEnabled,
  parseJson,
} from "../../../../../lib/backend/http";
import { prisma } from "../../../../../lib/backend/prisma";
import { sendMessageSchema } from "../../../../../lib/backend/schemas";

const paramsSchema = z.object({ id: z.string().min(1) });

export async function POST(
  request: Request,
  context: RouteContext<"/api/conversations/[id]/messages">,
) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const { id } = paramsSchema.parse(await context.params);
    const { body } = await parseJson(request, sendMessageSchema);

    const conversation = await prisma.conversation.findFirst({
      where: { id, workspaceId: DEMO_WORKSPACE_ID },
      select: { id: true },
    });
    if (!conversation) throw new ApiError(404, "Conversation not found.", "NOT_FOUND");

    const created = await prisma.$transaction(async (transaction) => {
      const message = await transaction.message.create({
        data: {
          conversationId: id,
          direction: "OUTGOING",
          body,
          deliveryStatus: "LOCAL_ONLY",
        },
      });

      await transaction.conversation.update({
        where: { id },
        data: {
          preview: body,
          lastMessageAt: message.createdAt,
          needsReply: false,
        },
      });

      return message;
    });

    return Response.json(
      {
        data: {
          id: created.id,
          direction: "outgoing",
          text: created.body,
          createdAt: created.createdAt.toISOString(),
          deliveryStatus: created.deliveryStatus,
        },
      },
      { status: 201 },
    );
  });
}
