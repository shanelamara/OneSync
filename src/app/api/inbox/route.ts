import { Prisma } from "@prisma/client";
import { z } from "zod";
import { conversationDto } from "../../../lib/backend/dto";
import { DEMO_WORKSPACE_ID } from "../../../lib/backend/constants";
import { apiHandler, assertBackendEnabled } from "../../../lib/backend/http";
import { prisma } from "../../../lib/backend/prisma";

const querySchema = z.object({
  q: z.string().trim().max(120).optional(),
  filter: z.enum(["all", "unassigned", "mine", "needs-reply", "orders"]).default("all"),
  channel: z.enum(["all", "facebook", "instagram", "tiktok", "viber", "whatsapp"]).default("all"),
});

const platformByFilter: Record<string, string> = {
  facebook: "FACEBOOK",
  instagram: "INSTAGRAM",
  tiktok: "TIKTOK",
  viber: "VIBER",
  whatsapp: "WHATSAPP",
};

export async function GET(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const url = new URL(request.url);
    const query = querySchema.parse({
      q: url.searchParams.get("q") ?? undefined,
      filter: url.searchParams.get("filter") ?? undefined,
      channel: url.searchParams.get("channel") ?? undefined,
    });

    const where: Prisma.ConversationWhereInput = { workspaceId: DEMO_WORKSPACE_ID };
    if (query.filter === "unassigned") where.assignedToId = null;
    if (query.filter === "mine") where.assignedToId = { not: null };
    if (query.filter === "needs-reply") where.needsReply = true;
    if (query.filter === "orders") where.orders = { some: {} };
    if (query.channel !== "all") {
      where.channelAccount = { platform: platformByFilter[query.channel] };
    }
    if (query.q) {
      where.OR = [
        { customer: { name: { contains: query.q } } },
        { customer: { handle: { contains: query.q } } },
        { preview: { contains: query.q } },
        { tags: { contains: query.q } },
      ];
    }

    const rows = await prisma.conversation.findMany({
      where,
      orderBy: { lastMessageAt: "desc" },
      take: 200,
      include: {
        customer: true,
        channelAccount: true,
        messages: { orderBy: { createdAt: "asc" }, take: 100 },
        orders: { select: { id: true }, take: 1 },
      },
    });

    return Response.json({ data: rows.map((row) => conversationDto(row)) });
  });
}
