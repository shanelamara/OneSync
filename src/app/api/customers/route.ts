import { z } from "zod";
import { DEMO_WORKSPACE_ID } from "../../../lib/backend/constants";
import {
  apiHandler,
  assertBackendEnabled,
  parseJson,
} from "../../../lib/backend/http";
import { prisma } from "../../../lib/backend/prisma";

const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(160),
  handle: z.string().trim().max(160).default(""),
  phone: z.string().trim().max(40).default(""),
  address: z.string().trim().max(500).default(""),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).default([]),
}).strict();

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const customers = await prisma.customer.findMany({
      where: { workspaceId: DEMO_WORKSPACE_ID },
      orderBy: { name: "asc" },
      take: 500,
      include: {
        channels: true,
        conversations: {
          orderBy: { lastMessageAt: "desc" },
          take: 1,
          include: { channelAccount: { select: { platform: true } } },
        },
        _count: { select: { orders: true } },
      },
    });
    return Response.json({
      data: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        handle: customer.handle,
        phone: customer.phone,
        address: customer.address,
        tags: customer.tags.split(",").filter(Boolean),
        createdAt: customer.createdAt.toISOString(),
        channels: customer.channels.map((channel) => ({
          platform: channel.platform,
          handle: channel.handle,
        })),
        orderCount: customer._count.orders,
        lastMessageAt: customer.conversations[0]?.lastMessageAt.toISOString() ?? null,
        lastChannel: customer.conversations[0]?.channelAccount.platform ?? null,
      })),
    });
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const input = await parseJson(request, createCustomerSchema);
    const customer = await prisma.customer.create({
      data: {
        workspaceId: DEMO_WORKSPACE_ID,
        name: input.name,
        handle: input.handle,
        phone: input.phone,
        address: input.address,
        tags: input.tags.join(","),
      },
    });
    return Response.json({ data: customer }, { status: 201 });
  });
}
