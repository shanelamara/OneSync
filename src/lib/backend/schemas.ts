import { z } from "zod";

export const conversationStatusSchema = z.enum(["OPEN", "PENDING", "RESOLVED"]);

export const sendMessageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
}).strict();

export const updateConversationSchema = z.object({
  status: conversationStatusSchema.optional(),
  assignedToId: z.string().min(1).nullable().optional(),
  assignToOwner: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "Provide at least one conversation field to update.",
});

export const createOrderSchema = z.object({
  customerId: z.string().min(1),
  conversationId: z.string().min(1).optional(),
  shippingFee: z.number().int().min(0).max(100_000).default(0),
  items: z.array(
    z.object({
      name: z.string().trim().min(1).max(120),
      variant: z.string().trim().max(120).default(""),
      quantity: z.number().int().min(1).max(1000),
      unitPrice: z.number().int().min(0).max(1_000_000),
    }).strict(),
  ).min(1).max(50),
}).strict();

export const createClaimSchema = z.object({
  customerName: z.string().trim().min(1).max(160),
  customerHandle: z.string().trim().max(160).default(""),
  productName: z.string().trim().min(1).max(160),
  variant: z.string().trim().max(120).default(""),
  quantity: z.number().int().min(1).max(1000).default(1),
  comment: z.string().trim().max(2000).default(""),
  status: z.enum(["CONFIRMED", "WAITLIST", "NEEDS_REVIEW"]).default("NEEDS_REVIEW"),
}).strict();

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  role: z.enum(["ADMIN", "AGENT"]).default("AGENT"),
}).strict();

export const savedReplySchema = z.object({
  title: z.string().trim().min(1).max(100),
  shortcut: z.string().trim().regex(/^\/[a-z0-9_-]{1,30}$/i),
  message: z.string().trim().min(1).max(4000),
}).strict();

export const businessHoursSchema = z.object({
  timezone: z.string().trim().min(1).max(80),
  awayMessage: z.string().trim().max(2000),
  hours: z.array(
    z.object({
      weekday: z.number().int().min(1).max(7),
      isClosed: z.boolean(),
      opensAt: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
      closesAt: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    }).strict(),
  ).length(7).refine(
    (hours) => new Set(hours.map((hour) => hour.weekday)).size === 7,
    "Each weekday must be present exactly once.",
  ),
}).strict();
