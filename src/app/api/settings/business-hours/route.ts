import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  assertBackendEnabled,
  parseJson,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";
import { businessHoursSchema } from "../../../../lib/backend/schemas";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const workspace = await prisma.workspace.findUniqueOrThrow({
      where: { id: DEMO_WORKSPACE_ID },
      select: { timezone: true, awayMessage: true },
    });
    const hours = await prisma.businessHour.findMany({
      where: { workspaceId: DEMO_WORKSPACE_ID },
      orderBy: { weekday: "asc" },
    });
    return Response.json({ data: { ...workspace, hours } });
  });
}

export async function PUT(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const input = await parseJson(request, businessHoursSchema);
    const saved = await prisma.$transaction(async (transaction) => {
      await transaction.workspace.update({
        where: { id: DEMO_WORKSPACE_ID },
        data: { timezone: input.timezone, awayMessage: input.awayMessage },
      });
      for (const hour of input.hours) {
        await transaction.businessHour.upsert({
          where: {
            workspaceId_weekday: {
              workspaceId: DEMO_WORKSPACE_ID,
              weekday: hour.weekday,
            },
          },
          create: { ...hour, workspaceId: DEMO_WORKSPACE_ID },
          update: {
            isClosed: hour.isClosed,
            opensAt: hour.opensAt,
            closesAt: hour.closesAt,
          },
        });
      }
      return transaction.businessHour.findMany({
        where: { workspaceId: DEMO_WORKSPACE_ID },
        orderBy: { weekday: "asc" },
      });
    });
    return Response.json({
      data: { timezone: input.timezone, awayMessage: input.awayMessage, hours: saved },
    });
  });
}
