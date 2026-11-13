import { z } from "zod";
import { conversationDto } from "../../../../lib/backend/dto";
import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  ApiError,
  assertBackendEnabled,
  parseJson,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";
import { updateConversationSchema } from "../../../../lib/backend/schemas";

const paramsSchema = z.object({ id: z.string().min(1) });

export async function GET(
  _request: Request,
  context: RouteContext<"/api/conversations/[id]">,
) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const { id } = paramsSchema.parse(await context.params);
    const row = await prisma.conversation.findFirst({
      where: { id, workspaceId: DEMO_WORKSPACE_ID },
      include: {
        customer: { include: { channels: true } },
        channelAccount: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: "asc" } },
        orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!row) throw new ApiError(404, "Conversation not found.", "NOT_FOUND");

    return Response.json({
      data: {
        ...conversationDto(row),
        assignedTo: row.assignedTo,
        customer: {
          ...row.customer,
          tags: row.customer.tags.split(",").filter(Boolean),
        },
        orders: row.orders,
      },
    });
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/conversations/[id]">,
) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const { id } = paramsSchema.parse(await context.params);
    const input = await parseJson(request, updateConversationSchema);
    const current = await prisma.conversation.findFirst({
      where: { id, workspaceId: DEMO_WORKSPACE_ID },
      select: { id: true },
    });
    if (!current) throw new ApiError(404, "Conversation not found.", "NOT_FOUND");

    let assignedToId = input.assignedToId;
    if (input.assignToOwner) {
      const owner = await prisma.teamMember.findFirst({
        where: { workspaceId: DEMO_WORKSPACE_ID, role: "OWNER", status: "ACTIVE" },
        select: { id: true },
      });
      if (!owner) throw new ApiError(409, "The workspace owner is not configured.", "OWNER_NOT_FOUND");
      assignedToId = owner.id;
    }

    if (assignedToId) {
      const member = await prisma.teamMember.findFirst({
        where: { id: assignedToId, workspaceId: DEMO_WORKSPACE_ID, status: "ACTIVE" },
        select: { id: true },
      });
      if (!member) throw new ApiError(400, "The selected team member is not active in this workspace.", "INVALID_ASSIGNEE");
    }

    const data: { status?: string; assignedToId?: string | null } = {};
    if (input.status) data.status = input.status;
    if (input.assignedToId !== undefined || input.assignToOwner) {
      data.assignedToId = assignedToId ?? null;
    }

    const updated = await prisma.conversation.update({
      where: { id },
      data,
      include: {
        customer: true,
        channelAccount: true,
        messages: { orderBy: { createdAt: "asc" }, take: 100 },
        orders: { select: { id: true }, take: 1 },
      },
    });
    return Response.json({ data: conversationDto(updated) });
  });
}
