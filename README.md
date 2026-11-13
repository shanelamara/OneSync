# OneSync

OneSync is a shared customer messaging and sales workspace for small businesses and social-commerce sellers in the Philippines. It brings conversations from channels such as Facebook Messenger, Instagram, and Viber into one place, helping teams respond faster, keep customer context, and turn inquiries into sales.

> **Product concept:** This README describes the product direction and proposed roadmap. It does not imply that every listed feature is already implemented.

## The opportunity

Small teams often manage customer conversations across several social accounts and messaging apps. Messages get missed, customer details are scattered, and sellers have to manually turn comments and payment screenshots into orders.

OneSync aims to make that work easier with a unified inbox, useful automations, and workflows designed for local businesses.

## Product principles

- **One customer, one view:** Bring a customer's conversations and relevant context together across connected channels.
- **Built for selling:** Help teams move from questions and comments to orders, payments, and follow-ups.
- **Useful AI, with human control:** Suggest and organize; let the business decide what gets sent or confirmed.
- **Local by default:** Prioritize Filipino and Taglish conversations, local channels, payment methods, and seller workflows.
- **Simple for small teams:** Make setup and daily operations approachable for solo sellers and growing teams.

## Proposed standout features

These are the initial differentiators to prioritize:

1. **Unified customer profile** — Connect a customer's conversations across platforms and keep their history and details in one view.
2. **Live-selling comment-to-order capture** — Turn claim comments such as “mine” or “steal” into a reviewable order list.
3. **Payment screenshot assistance** — Detect likely GCash, Maya, or bank-transfer proof in a conversation and flag it for human confirmation.
4. **Taglish and Filipino AI reply suggestions** — Help agents draft context-aware replies in the customer's language, with the agent reviewing before sending.

## Feature roadmap

The ideas below describe possible product capabilities, grouped by the problems they solve. They are roadmap ideas, not a promise of availability or a committed delivery schedule.

### Smarter inbox

- Priority inbox that highlights valuable leads, repeat buyers, and complaints.
- Unified view of a customer's public comments and private messages.
- Cross-channel duplicate detection.
- Smart snooze that resurfaces chats when a customer replies or a deadline arrives.
- Shared reply drafts for teammate review and a read-only watch mode for owners.

### Sales and commerce

- Product cards with photos and prices that agents can share in chat.
- Quote and invoice generation from a conversation.
- Order-status replies and courier integrations such as J&T, LBC, Flash Express, and Lalamove.
- Follow-ups for inquiries that went quiet after asking about a product or price.
- Contextual add-on suggestions, plus booking and appointment workflows with calendar sync.

### Customer experience

- Quick-reply menus for common questions such as prices, location, and order status.
- Per-account or per-brand business hours and holiday schedules.
- Customer satisfaction surveys after a conversation is resolved.
- Customer segments and broadcasts that respect each platform's messaging rules and limits.
- Language detection and voice-note transcription.

### Brand protection

- Flags for suspicious links, scams, and phishing attempts.
- Keyword alerts for terms such as “scam,” “refund,” and “sira.”
- Alerts for unusual increases in negative messages, with an optional holding response.
- Shared blocklists and monitoring for brand tags and mentions.

### Teams, brands, and agencies

- Separate workspaces, teams, templates, and reports for each brand.
- An owner dashboard across brands.
- Client approval workflows for agencies and social media managers.
- Optional white-labeling and per-brand billing.

### Automation and owner tools

- Visual rules for tagging, assigning, and responding to messages.
- Service-level timers and escalation when a reply is overdue.
- Assignment by language or product.
- Webhooks and integrations with tools such as Google Sheets, Odoo, Slack, Zapier, and Make.
- Scheduled reports, daily owner digests, revenue attribution, and agent performance metrics.
- An onboarding flow designed to make connecting a Facebook Page quick and straightforward.
- An offline-friendly mobile experience for replying on weak connections.

## Philippine market focus

OneSync is intended to support the way local small businesses sell and communicate:

- Filipino and Taglish language understanding for reply assistance and sentiment signals.
- Messenger and Viber as important channels, alongside other supported platforms.
- Seller workflows for live-selling comments and order capture.
- Payment-proof assistance for GCash, Maya, and bank transfers, with manual verification.
- Affordable plans for solo sellers and teams, including a possible per-agent option.

## Who it's for

- Solo sellers and small businesses handling customer inquiries themselves.
- Social-commerce and live-selling merchants.
- Teams that need shared ownership of conversations and follow-ups.
- Agencies and social media managers working across multiple client brands.

## Repository structure

The project uses the Next.js App Router with TypeScript. The route and feature directories follow the screens in the interface menu.

```text
.
├── docs/
├── public/
├── scripts/
├── src/
│   ├── app/                       # Routes mirror the sidebar and settings menu
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── inbox/
│   │   ├── orders/
│   │   ├── live/
│   │   │   └── go-live/
│   │   ├── customers/
│   │   ├── reports/
│   │   └── settings/
│   │       ├── channels/
│   │       ├── team/
│   │       ├── saved-replies/
│   │       ├── business-hours/
│   │       └── billing/
│   ├── components/                # Shared app shell, icons, and page components
│   ├── features/                  # Screen-specific interface and behavior
│   │   ├── inbox/
│   │   ├── orders/
│   │   ├── live/
│   │   ├── customers/
│   │   ├── reports/
│   │   └── settings/
│   ├── integrations/              # Planned messaging, courier, and payment adapters
│   └── shared/                    # Planned shared utilities, styles, and types
├── tests/
│   ├── integration/
│   └── unit/
├── package.json
├── package-lock.json
└── tsconfig.json
```

The menu routes are `/inbox`, `/orders`, `/live`, `/live/go-live`, `/customers`, `/reports`, and the five `/settings/*` pages. Next.js route entry points live in `src/app/`; menu-specific UI lives in the matching `src/features/` folder.

## Status

The repository includes a responsive interface prototype with sample data. Sending replies and inbox filters work locally in the browser; messaging integrations, authentication, and persistent storage are not connected yet.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/inbox`.

```bash
npm run typecheck
npm run build
```
