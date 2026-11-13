import { z } from "zod";
import { DEMO_WORKSPACE_ID } from "../../../../../lib/backend/constants";
import {
  apiHandler,
  ApiError,
  assertBackendEnabled,
  parseJson,
} from "../../../../../lib/backend/http";
import { prisma } from "../../../../../lib/backend/prisma";
import { savedReplySchema } from "../../../../../lib/backend/schemas";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/settings/saved-replies/[id]">,
) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const { id } = z.object({ id: z.string().min(1) }).parse(await context.params);
    const input = await parseJson(request, savedReplySchema);
    const existing = await prisma.savedReply.findFirst({
      where: { id, workspaceId: DEMO_WORKSPACE_ID },
      select: { id: true },
    });
    if (!existing) throw new ApiError(404, "Saved reply not found.", "NOT_FOUND");
    const reply = await prisma.savedReply.update({ where: { id }, data: input });
    return Response.json({ data: reply });
  });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/settings/saved-replies/[id]">,
) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const { id } = z.object({ id: z.string().min(1) }).parse(await context.params);
    const existing = await prisma.savedReply.findFirst({
      where: { id, workspaceId: DEMO_WORKSPACE_ID },
      select: { id: true },
    });
    if (!existing) throw new ApiError(404, "Saved reply not found.", "NOT_FOUND");
    await prisma.savedReply.delete({ where: { id } });
    return new Response(null, { status: 204 });
  });
}
