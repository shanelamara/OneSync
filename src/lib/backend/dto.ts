import { PLATFORM_CODES } from "./constants";

export function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function relativeTime(date: Date, now = new Date()) {
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}h`;
  if (minutes < 60 * 48) return "1d";
  return `${Math.floor(minutes / (60 * 24))}d`;
}

export function localTime(date: Date) {
  return new Intl.DateTimeFormat("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Manila",
  }).format(date);
}

export function conversationDto(
  conversation: {
    id: string;
    status: string;
    needsReply: boolean;
    tags: string;
    preview: string;
    lastMessageAt: Date;
    assignedToId: string | null;
    customer: { id: string; name: string; handle: string; tags: string };
    channelAccount: { platform: string; name: string; handle: string; status: string };
    messages: {
      id: string;
      direction: string;
      body: string;
      deliveryStatus: string;
      createdAt: Date;
    }[];
    orders: { id: string }[];
  },
  now = new Date(),
) {
  const name = conversation.customer.name;
  const initials = name
    .replace(/^@/, "")
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    id: conversation.id,
    customerId: conversation.customer.id,
    initials,
    name,
    handle: conversation.customer.handle,
    channel: PLATFORM_CODES[conversation.channelAccount.platform] ?? "FB",
    channelName: conversation.channelAccount.name,
    channelHandle: conversation.channelAccount.handle,
    channelStatus: conversation.channelAccount.status,
    time: relativeTime(conversation.lastMessageAt, now),
    lastMessageAt: conversation.lastMessageAt.toISOString(),
    preview: conversation.preview,
    tags: parseList(conversation.tags),
    mine: Boolean(conversation.assignedToId),
    assignedToId: conversation.assignedToId,
    needsReply: conversation.needsReply,
    order: conversation.orders.length > 0,
    status: conversation.status,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      direction: message.direction.toLowerCase(),
      text: message.body,
      time: localTime(message.createdAt),
      deliveryStatus: message.deliveryStatus,
      createdAt: message.createdAt.toISOString(),
    })),
  };
}
