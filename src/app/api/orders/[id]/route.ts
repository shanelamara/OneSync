import { z } from "zod";
import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  ApiError,
  assertBackendEnabled,
  parseJson,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";

const paramsSchema = z.object({ id: z.string().min(1) });
const updateOrderSchema = z.object({
  paymentStatus: z.enum(["PENDING_PAYMENT", "PAID", "REFUNDED"]).optional(),
  fulfillmentStatus: z.enum([
    "NOT_SHIPPED",
    "TO_PACK",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "DELIVERY_FAILED",
  ]).optional(),
  courier: z.string().trim().max(80).optional(),
  trackingNumber: z.string().trim().max(120).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "Provide at least one order field to update.",
});

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/orders/[id]">,
) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const { id } = paramsSchema.parse(await context.params);
    const input = await parseJson(request, updateOrderSchema);
    const order = await prisma.order.findFirst({
      where: { id, workspaceId: DEMO_WORKSPACE_ID },
      select: { id: true },
    });
    if (!order) throw new ApiError(404, "Order not found.", "NOT_FOUND");
    const updated = await prisma.order.update({
      where: { id },
      data: input,
      include: { customer: { select: { id: true, name: true } }, items: true },
    });
    return Response.json({
      data: { ...updated, createdAt: updated.createdAt.toISOString() },
    });
  });
}
