import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  ApiError,
  assertBackendEnabled,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const channels = await prisma.channelAccount.findMany({
      where: { workspaceId: DEMO_WORKSPACE_ID },
      orderBy: { platform: "asc" },
      select: {
        id: true,
        platform: true,
        name: true,
        handle: true,
        accountType: true,
        status: true,
        createdAt: true,
      },
    });
    return Response.json({
      data: channels.map((channel) => ({
        ...channel,
        createdAt: channel.createdAt.toISOString(),
      })),
    });
  });
}

export async function POST() {
  return apiHandler(async () => {
    assertBackendEnabled();
    throw new ApiError(
      501,
      "Channel authorization requires platform OAuth credentials and is not configured yet.",
      "OAUTH_NOT_CONFIGURED",
    );
  });
}
