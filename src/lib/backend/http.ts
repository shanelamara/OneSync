import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code = "REQUEST_ERROR",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiHandler(
  handler: () => Promise<Response>,
): Promise<Response> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      return Response.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    if (error instanceof ZodError) {
      return Response.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "The request data is invalid.",
            details: error.issues.map((issue) => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          },
        },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return Response.json(
          { error: { code: "NOT_FOUND", message: "The requested record was not found." } },
          { status: 404 },
        );
      }

      if (error.code === "P2002") {
        return Response.json(
          { error: { code: "CONFLICT", message: "A record with that value already exists." } },
          { status: 409 },
        );
      }
    }

    console.error("OneSync API request failed", error);
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected server error occurred." } },
      { status: 500 },
    );
  }
}

export function assertBackendEnabled() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ONESYNC_ALLOW_UNAUTHENTICATED_DEMO_API !== "true"
  ) {
    throw new ApiError(
      503,
      "The demo API is disabled in production until authentication is configured.",
      "AUTHENTICATION_REQUIRED",
    );
  }
}

export function parseJson<T>(request: Request, schema: { parse(value: unknown): T }) {
  return request.json().then((value: unknown) => schema.parse(value));
}
