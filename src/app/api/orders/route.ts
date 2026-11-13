import { randomUUID } from "node:crypto";
import { z } from "zod";
import { DEMO_WORKSPACE_ID } from "../../../lib/backend/constants";
import { apiHandler, ApiError, assertBackendEnabled, parseJson } from "../../../lib/backend/http";
import { prisma } from "../../../lib/backend/prisma";
import { createOrderSchema } from "../../../lib/backend/schemas";

const querySchema = z.object({
  status: z.enum(["all", "pending-payment", "to-pack", "shipped", "delivered", "needs-attention"]).default("all"),
  q: z.string().trim().max(120).optional(),
});

const statuses: Record<string, string> = {
  "pending-payment": "PENDING_PAYMENT",
  "to-pack": "TO_PACK",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  "needs-attention": "DELIVERY_FAILED",
};

function orderDto(order: {
  id: string;
  orderNumber: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  courier: string;
  trackingNumber: string;
  shippingFee: number;
  total: number;
  createdAt: Date;
  customer: { id: string; name: string };
  items: { id: string; name: string; variant: string; quantity: number; unitPrice: number }[];
}) {
  return {
    ...order,
    totalPhp: order.total,
    createdAt: order.createdAt.toISOString(),
  };
}

export async function GET(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const url = new URL(request.url);
    const query = querySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
    });
    const where = {
      workspaceId: DEMO_WORKSPACE_ID,
      ...(query.status === "all" ? {} : { fulfillmentStatus: statuses[query.status] }),
      ...(query.q
        ? {
            OR: [
              { orderNumber: { contains: query.q } },
              { customer: { name: { contains: query.q } } },
              { customer: { handle: { contains: query.q } } },
            ],
          }
        : {}),
    };
    const rows = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { customer: { select: { id: true, name: true } }, items: true },
    });
    return Response.json({ data: rows.map(orderDto) });
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const input = await parseJson(request, createOrderSchema);
    const customer = await prisma.customer.findFirst({
      where: { id: input.customerId, workspaceId: DEMO_WORKSPACE_ID },
      select: { id: true },
    });
    if (!customer) throw new ApiError(400, "Customer does not exist in this workspace.", "INVALID_CUSTOMER");

    if (input.conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: input.conversationId,
          workspaceId: DEMO_WORKSPACE_ID,
          customerId: input.customerId,
        },
        select: { id: true },
      });
      if (!conversation) {
        throw new ApiError(400, "Conversation does not belong to this customer.", "INVALID_CONVERSATION");
      }
    }

    const itemsTotal = input.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0,
    );
    if (!Number.isSafeInteger(itemsTotal + input.shippingFee) || itemsTotal + input.shippingFee > 2_000_000_000) {
      throw new ApiError(400, "Order total is outside the supported range.", "INVALID_TOTAL");
    }

    const order = await prisma.order.create({
      data: {
        workspaceId: DEMO_WORKSPACE_ID,
        customerId: input.customerId,
        conversationId: input.conversationId,
        orderNumber: `ORD-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
        total: itemsTotal + input.shippingFee,
        shippingFee: input.shippingFee,
        items: { create: input.items },
      },
      include: { customer: { select: { id: true, name: true } }, items: true },
    });
    return Response.json({ data: orderDto(order) }, { status: 201 });
  });
}
