import { DEMO_WORKSPACE_ID } from "../../../../lib/backend/constants";
import {
  apiHandler,
  assertBackendEnabled,
  parseJson,
} from "../../../../lib/backend/http";
import { prisma } from "../../../../lib/backend/prisma";
import { createTeamMemberSchema } from "../../../../lib/backend/schemas";

export async function GET() {
  return apiHandler(async () => {
    assertBackendEnabled();
    const members = await prisma.teamMember.findMany({
      where: { workspaceId: DEMO_WORKSPACE_ID },
      orderBy: [{ role: "asc" }, { name: "asc" }],
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
    return Response.json({
      data: members.map((member) => ({
        ...member,
        createdAt: member.createdAt.toISOString(),
      })),
    });
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    assertBackendEnabled();
    const input = await parseJson(request, createTeamMemberSchema);
    const member = await prisma.teamMember.create({
      data: {
        ...input,
        workspaceId: DEMO_WORKSPACE_ID,
        email: input.email.toLowerCase(),
        status: "INVITED",
      },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
    return Response.json(
      { data: { ...member, createdAt: member.createdAt.toISOString() } },
      { status: 201 },
    );
  });
}
