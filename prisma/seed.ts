import {
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();
const workspaceId = "demo-workspace";
const now = new Date();
const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000);
const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000);

async function seed() {
  await prisma.workspace.upsert({
    where: { id: workspaceId },
    update: { name: "Casa Verde Shop", timezone: "Asia/Manila" },
    create: { id: workspaceId, name: "Casa Verde Shop", timezone: "Asia/Manila" },
  });

  await prisma.conversation.deleteMany({ where: { workspaceId } });
  await prisma.order.deleteMany({ where: { workspaceId } });
  await prisma.liveSession.deleteMany({ where: { workspaceId } });
  await prisma.customer.deleteMany({ where: { workspaceId } });
  await prisma.channelAccount.deleteMany({ where: { workspaceId } });
  await prisma.teamMember.deleteMany({ where: { workspaceId } });
  await prisma.savedReply.deleteMany({ where: { workspaceId } });
  await prisma.businessHour.deleteMany({ where: { workspaceId } });
  await prisma.invoice.deleteMany({ where: { workspaceId } });

  const owner = await prisma.teamMember.create({
    data: {
      id: "owner",
      workspaceId,
      name: "Juan Mendoza",
      email: "juan@example.com",
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  await prisma.teamMember.createMany({
    data: [
      {
        id: "admin",
        workspaceId,
        name: "Maria Reyes",
        email: "maria@example.com",
        role: "ADMIN",
        status: "ACTIVE",
      },
      {
        id: "agent",
        workspaceId,
        name: "Paolo Cruz",
        email: "paolo@example.com",
        role: "AGENT",
        status: "INVITED",
      },
    ],
  });

  await prisma.channelAccount.createMany({
    data: [
      {
        id: "channel-facebook",
        workspaceId,
        platform: "FACEBOOK",
        name: "Facebook",
        handle: "Casa Verde Shop",
        accountType: "Facebook Page",
        status: "CONNECTED",
      },
      {
        id: "channel-instagram",
        workspaceId,
        platform: "INSTAGRAM",
        name: "Instagram",
        handle: "@casaverde.shop",
        accountType: "Professional account",
        status: "CONNECTED",
      },
      {
        id: "channel-tiktok",
        workspaceId,
        platform: "TIKTOK",
        name: "TikTok",
        handle: "@casaverde.shop",
        accountType: "Business account",
        status: "RECONNECT_REQUIRED",
      },
    ],
  });

  const customers = [
    { id: "maria-customer", name: "Maria Santos", handle: "@maria.s", tags: "Repeat buyer,VIP" },
    { id: "jaycee-customer", name: "@jaycee.finds", handle: "@jaycee.finds", tags: "New" },
    { id: "ana-customer", name: "Ana Dela Cruz", handle: "@ana.d", tags: "Cebu" },
    { id: "liza-customer", name: "Liza Ramos", handle: "@liza.ramos", tags: "VIP" },
    { id: "joy-customer", name: "Joy Aquino", handle: "@joy.a", tags: "COD" },
    { id: "ken-customer", name: "Ken Villanueva", handle: "@ken.v", tags: "Repeat buyer" },
    { id: "mika-customer", name: "@mikaela.shop", handle: "@mikaela.shop", tags: "Inquiry" },
  ];

  for (const customer of customers) {
    await prisma.customer.create({
      data: { ...customer, workspaceId },
    });
  }

  const conversations = [
    {
      id: "maria",
      customerId: "maria-customer",
      channelAccountId: "channel-facebook",
      assignedToId: null,
      status: "OPEN",
      needsReply: true,
      tags: "Live claim,Unread",
      preview: "Sige po, kukunin ko. Pwede ba GCash?",
      lastMessageAt: minutesAgo(2),
      messages: [
        { direction: "INCOMING", body: "Hi po! Available pa ba yung floral dress na nasa live kagabi? Size M po.", createdAt: minutesAgo(6) },
        { direction: "OUTGOING", body: "Hello Maria! Yes po, may 2 pieces pa sa size M.", createdAt: minutesAgo(4) },
        { direction: "INCOMING", body: "Sige po, kukunin ko. Pwede ba GCash?", createdAt: minutesAgo(2) },
      ],
    },
    {
      id: "jaycee",
      customerId: "jaycee-customer",
      channelAccountId: "channel-instagram",
      assignedToId: owner.id,
      status: "OPEN",
      needsReply: true,
      tags: "Payment proof",
      preview: "Sent GCash screenshot po",
      lastMessageAt: minutesAgo(8),
      messages: [
        { direction: "INCOMING", body: "Sent GCash screenshot po. Pa-check na lang if pumasok. Thank you!", createdAt: minutesAgo(8) },
      ],
    },
    {
      id: "ana",
      customerId: "ana-customer",
      channelAccountId: "channel-tiktok",
      assignedToId: null,
      status: "PENDING",
      needsReply: true,
      tags: "Inquiry",
      preview: "Magkano shipping to Cebu?",
      lastMessageAt: minutesAgo(15),
      messages: [
        { direction: "INCOMING", body: "Magkano po shipping to Cebu?", createdAt: minutesAgo(15) },
      ],
    },
    {
      id: "liza",
      customerId: "liza-customer",
      channelAccountId: "channel-facebook",
      assignedToId: owner.id,
      status: "OPEN",
      needsReply: false,
      tags: "Live claim",
      preview: "mine po! Floral dress #12",
      lastMessageAt: minutesAgo(24),
      messages: [
        { direction: "INCOMING", body: "mine po! Floral dress #12", createdAt: minutesAgo(24) },
      ],
    },
    {
      id: "joy",
      customerId: "joy-customer",
      channelAccountId: "channel-facebook",
      assignedToId: null,
      status: "OPEN",
      needsReply: true,
      tags: "Unassigned",
      preview: "Pwede po bang COD?",
      lastMessageAt: minutesAgo(120),
      messages: [
        { direction: "INCOMING", body: "Pwede po bang COD?", createdAt: minutesAgo(120) },
      ],
    },
    {
      id: "ken",
      customerId: "ken-customer",
      channelAccountId: "channel-instagram",
      assignedToId: owner.id,
      status: "RESOLVED",
      needsReply: false,
      tags: "Resolved",
      preview: "Thank you po, received na!",
      lastMessageAt: minutesAgo(60 * 24),
      messages: [
        { direction: "INCOMING", body: "Thank you po, received na!", createdAt: minutesAgo(60 * 24) },
      ],
    },
    {
      id: "mika",
      customerId: "mika-customer",
      channelAccountId: "channel-tiktok",
      assignedToId: null,
      status: "PENDING",
      needsReply: false,
      tags: "Inquiry",
      preview: "Do you ship outside Metro Manila?",
      lastMessageAt: minutesAgo(60 * 24),
      messages: [
        { direction: "INCOMING", body: "Do you ship outside Metro Manila?", createdAt: minutesAgo(60 * 24) },
      ],
    },
  ];

  for (const conversation of conversations) {
    const { messages, ...data } = conversation;
    await prisma.conversation.create({
      data: {
        ...data,
        workspaceId,
        messages: { create: messages.map((message) => ({ ...message, isRead: true })) },
      },
    });
  }

  await prisma.order.create({
    data: {
      id: "order-0012",
      workspaceId,
      customerId: "maria-customer",
      conversationId: "maria",
      orderNumber: "0012",
      paymentStatus: "PENDING_PAYMENT",
      fulfillmentStatus: "NOT_SHIPPED",
      total: 450,
      shippingFee: 0,
      createdAt: minutesAgo(2),
      items: {
        create: [{ name: "Floral dress #12", variant: "M", quantity: 1, unitPrice: 450 }],
      },
    },
  });

  const orderRecords = [
    { id: "order-0011", customerId: "jaycee-customer", orderNumber: "0011", paymentStatus: "PAID", fulfillmentStatus: "TO_PACK", amount: 450, item: "Floral dress #12", courier: "" },
    { id: "order-0010", customerId: "liza-customer", orderNumber: "0010", paymentStatus: "PAID", fulfillmentStatus: "PACKED", amount: 890, item: "Floral dress #12, Linen top #07", courier: "J&T" },
    { id: "order-0009", customerId: "ana-customer", orderNumber: "0009", paymentStatus: "PAID", fulfillmentStatus: "SHIPPED", amount: 520, item: "Linen top #07", courier: "LBC" },
    { id: "order-0008", customerId: "ken-customer", orderNumber: "0008", paymentStatus: "PAID", fulfillmentStatus: "DELIVERED", amount: 520, item: "Linen top #07", courier: "Flash Express" },
    { id: "order-0007", customerId: "joy-customer", orderNumber: "0007", paymentStatus: "PAID", fulfillmentStatus: "DELIVERY_FAILED", amount: 450, item: "Floral dress #12", courier: "J&T" },
    { id: "order-0006", customerId: "mika-customer", orderNumber: "0006", paymentStatus: "PENDING_PAYMENT", fulfillmentStatus: "NOT_SHIPPED", amount: 520, item: "Linen top #07", courier: "" },
  ];

  for (const order of orderRecords) {
    await prisma.order.create({
      data: {
        id: order.id,
        workspaceId,
        customerId: order.customerId,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        total: order.amount,
        courier: order.courier,
        createdAt: minutesAgo(Number(order.orderNumber.slice(-2)) * 30),
        items: {
          create: [{ name: order.item, quantity: 1, unitPrice: order.amount }],
        },
      },
    });
  }

  await prisma.liveSession.create({
    data: {
      id: "live-spring-arrivals",
      workspaceId,
      title: "Spring arrivals",
      status: "LIVE",
      keywords: "mine,steal,#item code",
      startedAt: minutesAgo(90),
      claims: {
        create: [
          { customerName: "Maria Santos", customerHandle: "@maria.s", productName: "Floral dress #12", variant: "M", quantity: 1, comment: "mine #12", status: "CONFIRMED", createdAt: minutesAgo(76) },
          { customerName: "Liza Ramos", customerHandle: "@liza.ramos", productName: "Floral dress #12", variant: "M", quantity: 1, comment: "mine po! #12", status: "CONFIRMED", createdAt: minutesAgo(75) },
          { customerName: "@jaycee.finds", customerHandle: "@jaycee.finds", productName: "Floral dress #12", variant: "M", quantity: 1, comment: "mine #12", status: "WAITLIST", createdAt: minutesAgo(74) },
          { customerName: "Ken Villanueva", customerHandle: "@ken.v", productName: "Linen top #07", variant: "S", quantity: 1, comment: "mine #07", status: "CONFIRMED", createdAt: minutesAgo(69) },
          { customerName: "Joy Aquino", customerHandle: "@joy.a", productName: "Linen top #07", variant: "S", quantity: 2, comment: "steal #07 x2", status: "WAITLIST", createdAt: minutesAgo(68) },
          { customerName: "@mikaela.shop", customerHandle: "@mikaela.shop", productName: "Item not recognized", variant: "", quantity: 1, comment: "mine po pero size L?", status: "NEEDS_REVIEW", createdAt: minutesAgo(66) },
        ],
      },
    },
  });
  await prisma.savedReply.createMany({
    data: [
      { workspaceId, title: "GCash details", shortcut: "/gcash", message: "Hi [Customer name]! Ito po ang GCash details namin: [GCash number]. Pakisend po ang screenshot ng payment para ma-confirm ang order mo. Salamat!" },
      { workspaceId, title: "Shipping fees", shortcut: "/shipping", message: "Shipping fee depends on your location. Saan po kayo magpapadala?" },
      { workspaceId, title: "Size chart", shortcut: "/size", message: "Here po ang size guide namin. Let me know if you need help choosing a size!" },
      { workspaceId, title: "Order summary", shortcut: "/summary", message: "Thank you po! Ito ang summary ng order ninyo: [Order summary]." },
      { workspaceId, title: "Away message", shortcut: "/away", message: "Hi! Salamat sa message. Sarado pa kami ngayon, pero sasagutin ka namin pagbukas ng shop." },
    ],
  });

  await prisma.businessHour.createMany({
    data: Array.from({ length: 7 }, (_, index) => ({
      workspaceId,
      weekday: index + 1,
      isClosed: index === 6,
      opensAt: "09:00",
      closesAt: "18:00",
    })),
  });

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      awayMessage:
        "Hi! Salamat sa message. Sarado pa kami ngayon, pero sasagutin ka namin pagbukas ng shop.",
    },
  });

  await prisma.invoice.createMany({
    data: [
      { workspaceId, invoiceDate: new Date(now.getFullYear(), now.getMonth(), 1), amount: 499, status: "PAID" },
      { workspaceId, invoiceDate: new Date(now.getFullYear(), now.getMonth() - 1, 1), amount: 499, status: "PAID" },
    ],
  });
}

seed()
  .then(() => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error("Database seed failed", error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
