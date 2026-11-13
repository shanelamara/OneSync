"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "../../components/icon";

type Message = {
  direction: "incoming" | "outgoing";
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  initials: string;
  name: string;
  channel: "FB" | "IG" | "TT";
  time: string;
  preview: string;
  tags: string[];
  mine: boolean;
  needsReply: boolean;
  order: boolean;
  status: "Open" | "Pending" | "Resolved";
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "maria",
    initials: "MS",
    name: "Maria Santos",
    channel: "FB",
    time: "2m",
    preview: "Sige po, kukunin ko. Pwede ba GCash?",
    tags: ["Live claim", "Unread"],
    mine: false,
    needsReply: true,
    order: true,
    status: "Open",
    messages: [
      {
        direction: "incoming",
        text: "Hi po! Available pa ba yung floral dress na nasa live kagabi? Size M po.",
        time: "10:42",
      },
      {
        direction: "outgoing",
        text: "Hello Maria! Yes po, may 2 pieces pa sa size M.",
        time: "10:44",
      },
      {
        direction: "incoming",
        text: "Sige po, kukunin ko. Pwede ba GCash?",
        time: "10:46",
      },
    ],
  },
  {
    id: "jaycee",
    initials: "JC",
    name: "@jaycee.finds",
    channel: "IG",
    time: "8m",
    preview: "Sent GCash screenshot po",
    tags: ["Payment proof"],
    mine: true,
    needsReply: true,
    order: true,
    status: "Open",
    messages: [
      {
        direction: "incoming",
        text: "Sent GCash screenshot po. Pa-check na lang if pumasok. Thank you!",
        time: "10:38",
      },
    ],
  },
  {
    id: "ana",
    initials: "AD",
    name: "Ana Dela Cruz",
    channel: "TT",
    time: "15m",
    preview: "Magkano shipping to Cebu?",
    tags: ["Inquiry"],
    mine: false,
    needsReply: true,
    order: false,
    status: "Pending",
    messages: [
      {
        direction: "incoming",
        text: "Magkano po shipping to Cebu?",
        time: "10:31",
      },
    ],
  },
  {
    id: "liza",
    initials: "LR",
    name: "Liza Ramos",
    channel: "FB",
    time: "24m",
    preview: "mine po! Floral dress #12",
    tags: ["Live claim"],
    mine: true,
    needsReply: false,
    order: true,
    status: "Open",
    messages: [
      {
        direction: "incoming",
        text: "mine po! Floral dress #12",
        time: "10:22",
      },
    ],
  },
  {
    id: "joy",
    initials: "JA",
    name: "Joy Aquino",
    channel: "FB",
    time: "2h",
    preview: "Pwede po bang COD?",
    tags: ["Unassigned"],
    mine: false,
    needsReply: true,
    order: false,
    status: "Open",
    messages: [
      {
        direction: "incoming",
        text: "Pwede po bang COD?",
        time: "08:40",
      },
    ],
  },
  {
    id: "ken",
    initials: "KV",
    name: "Ken Villanueva",
    channel: "IG",
    time: "1d",
    preview: "Thank you po, received na!",
    tags: ["Resolved"],
    mine: true,
    needsReply: false,
    order: false,
    status: "Resolved",
    messages: [
      {
        direction: "incoming",
        text: "Thank you po, received na!",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "mika",
    initials: "MK",
    name: "@mikaela.shop",
    channel: "TT",
    time: "1d",
    preview: "Do you ship outside Metro Manila?",
    tags: ["Inquiry"],
    mine: false,
    needsReply: false,
    order: false,
    status: "Pending",
    messages: [
      {
        direction: "incoming",
        text: "Do you ship outside Metro Manila?",
        time: "Yesterday",
      },
    ],
  },
];

const filters = ["All", "Unassigned", "Mine", "Needs reply", "Orders"];

function channelName(channel: Conversation["channel"]) {
  if (channel === "FB") return "Facebook Messenger";
  if (channel === "IG") return "Instagram DM";
  return "TikTok";
}

function formatTime() {
  return new Intl.DateTimeFormat("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Manila",
  }).format(new Date());
}

export function InboxScreen() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState("maria");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [showConversation, setShowConversation] = useState(false);

  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesSearch =
        !query ||
        `${conversation.name} ${conversation.preview} ${conversation.tags.join(" ")}`
          .toLowerCase()
          .includes(query);
      const matchesChannel =
        channelFilter === "all" ||
        (channelFilter === "facebook" && conversation.channel === "FB") ||
        (channelFilter === "instagram" && conversation.channel === "IG") ||
        (channelFilter === "tiktok" && conversation.channel === "TT");
      const matchesFilter =
        filter === "All" ||
        (filter === "Unassigned" && !conversation.mine) ||
        (filter === "Mine" && conversation.mine) ||
        (filter === "Needs reply" && conversation.needsReply) ||
        (filter === "Orders" && conversation.order);
      return matchesSearch && matchesChannel && matchesFilter;
    });
  }, [channelFilter, conversations, filter, search]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ?? null;

  function updateActiveConversation(update: Partial<Conversation>) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId ? { ...conversation, ...update } : conversation,
      ),
    );
  }

  function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || !activeConversation) return;

    const time = formatTime();
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              preview: message,
              time: "now",
              needsReply: false,
              messages: [...conversation.messages, { direction: "outgoing", text: message, time }],
            }
          : conversation,
      ),
    );
    setDraft("");
  }

  return (
    <div className="inbox-layout">
      <section
        aria-label="Conversations"
        className={`conversation-list${showConversation ? " mobile-hidden" : ""}`}
      >
        <div className="inbox-toolbar">
          <div className="section-heading-row">
            <h1 className="section-heading">Inbox</h1>
            <button aria-label="More inbox options" className="icon-button" type="button">
              <Icon name="more" size={16} />
            </button>
          </div>
          <label className="account-select">
            <select
              aria-label="Account filter"
              onChange={(event) => setChannelFilter(event.target.value)}
              value={channelFilter}
            >
              <option value="all">All accounts</option>
              <option value="facebook">Facebook: [Your Page]</option>
              <option value="instagram">Instagram: [your handle]</option>
              <option value="tiktok">TikTok: [your handle]</option>
            </select>
          </label>
          <label className="search-box">
            <Icon name="search" size={15} />
            <input
              aria-label="Search conversations"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, message or order"
              value={search}
            />
          </label>
          <div aria-label="Conversation filters" className="filter-tabs">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item}
                className={`filter-tab${filter === item ? " active" : ""}`}
                key={item}
                onClick={() => setFilter(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="conversation-rows">
          {visibleConversations.length ? (
            visibleConversations.map((conversation) => (
              <button
                aria-pressed={activeId === conversation.id}
                className={`conversation-row${activeId === conversation.id ? " selected" : ""}`}
                key={conversation.id}
                onClick={() => {
                  setActiveId(conversation.id);
                  setShowConversation(true);
                }}
                type="button"
              >
                <span className="avatar-wrap">
                  <span className="avatar">{conversation.initials}</span>
                  <span
                    className={`channel-mark${conversation.channel === "IG" ? " ig" : ""}${conversation.channel === "TT" ? " tt" : ""}`}
                  >
                    {conversation.channel}
                  </span>
                </span>
                <span className="conversation-copy">
                  <span className="row-top">
                    <span className="customer-name">{conversation.name}</span>
                    <span className="time-label">{conversation.time}</span>
                  </span>
                  <span className="preview-text">{conversation.preview}</span>
                  <span className="tag-row">
                    {conversation.tags.map((tag) => (
                      <span
                        className={`tag${tag === "Live claim" || tag === "Payment proof" ? " warm" : ""}`}
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="empty-results">No conversations match this view.</div>
          )}
        </div>
      </section>

      {activeConversation ? (
        <section
          aria-label="Conversation"
          className={`conversation-view${showConversation ? " mobile-visible" : ""}`}
        >
          <header className="conversation-top">
            <div className="conversation-identity">
              <button
                aria-label="Back to conversations"
                className="icon-button mobile-back"
                onClick={() => setShowConversation(false)}
                type="button"
              >
                <Icon name="arrow" size={16} />
              </button>
              <span className="avatar">{activeConversation.initials}</span>
              <div>
                <div className="identity-name">{activeConversation.name}</div>
                <div className="identity-subtitle">
                  {channelName(activeConversation.channel)} · [Your Page]
                </div>
              </div>
            </div>
            <div className="conversation-actions">
              <button
                className="text-button"
                onClick={() => updateActiveConversation({ mine: true })}
                type="button"
              >
                Assign to me
              </button>
              <button
                aria-label="More conversation actions"
                className="icon-button"
                type="button"
              >
                <Icon name="more" size={16} />
              </button>
            </div>
          </header>

          <div className="reply-window">
            <Icon name="clock" size={13} />
            Reply window: <strong>21h left</strong>
            <span>·</span>
            Status:
            <select
              aria-label="Conversation status"
              onChange={(event) => {
                const status = event.target.value;
                if (status === "Open" || status === "Pending" || status === "Resolved") {
                  updateActiveConversation({ status });
                }
              }}
              value={activeConversation.status}
            >
              <option>Open</option>
              <option>Pending</option>
              <option>Resolved</option>
            </select>
          </div>

          <div aria-live="polite" className="thread">
            <div className="thread-date">Today</div>
            {activeConversation.messages.map((message, index) => (
              <div className={`message ${message.direction}`} key={`${index}-${message.time}`}>
                <div className="message-bubble">{message.text}</div>
                <div className="message-time">{message.time}</div>
              </div>
            ))}
            {activeConversation.order ? (
              <div className="order-preview">
                <div className="order-card-head">
                  <span>Claimed in live</span>
                  <span>Floral dress #12 · M · ×1</span>
                </div>
                <div className="order-card-body">
                  <span aria-hidden="true" className="product-thumbnail">
                    ✿
                  </span>
                  <span>
                    <span className="product-name">Floral dress #12</span>
                    <span className="product-meta">Size M · ₱450</span>
                  </span>
                  <button className="order-add" type="button">
                    Add to order
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <form className="composer" onSubmit={sendReply}>
            <textarea
              aria-label="Write a reply"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Write a reply..."
              value={draft}
            />
            <div className="composer-tools">
              <div className="composer-tool-group">
                <button aria-label="Attach file" className="icon-button" type="button">
                  <Icon name="paperclip" size={16} />
                </button>
                <button aria-label="Suggest a reply" className="icon-button" type="button">
                  <Icon name="spark" size={16} />
                </button>
              </div>
              <button className="send-button" type="submit">
                Send <Icon name="send" size={13} />
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section
          aria-label="Conversation"
          className={`conversation-view${showConversation ? " mobile-visible" : ""}`}
        >
          <button
            aria-label="Back to conversations"
            className="icon-button mobile-back"
            onClick={() => setShowConversation(false)}
            type="button"
          >
            <Icon name="arrow" size={16} />
          </button>
          <div className="empty-results">Choose a conversation to see its messages.</div>
        </section>
      )}

      {activeConversation ? (
        <aside aria-label="Customer details" className="customer-panel">
          <h2 className="panel-heading">Customer profile</h2>
          <div className="customer-card">
            <div className="profile-heading">
              <span className="avatar">{activeConversation.initials}</span>
              <span>
                <span className="customer-card-name">{activeConversation.name}</span>
                <span className="customer-card-meta">Customer since Aug 2025</span>
              </span>
            </div>
            <div className="panel-tags">
              <span className="tag green">Repeat buyer</span>
              {activeConversation.order ? <span className="tag warm">Live seller</span> : null}
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">Linked accounts</div>
            <div className="account-item">
              <span className="account-badge">FB</span>
              <span className="account-detail">
                <span className="account-title">{activeConversation.name}</span>
                <span className="account-subtitle">Messenger</span>
              </span>
            </div>
            <div className="account-item">
              <span className="account-badge instagram">IG</span>
              <span className="account-detail">
                <span className="account-title">@maria.s</span>
                <span className="account-subtitle">Instagram DM</span>
              </span>
            </div>
            <button className="panel-link" type="button">
              + Merge another account
            </button>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">Contact</div>
            <div className="account-item">
              <span className="account-detail">
                <span className="account-title">Phone</span>
                <span className="account-subtitle">Add phone number</span>
              </span>
            </div>
            <div className="account-item">
              <span className="account-detail">
                <span className="account-title">Address</span>
                <span className="account-subtitle">Add delivery address</span>
              </span>
            </div>
          </div>

          <div className="panel-section">
            <div className="panel-section-title">Order history</div>
            <div className="history-item">
              <span>#[0012] · today</span>
              <span className="order-status">Pending payment</span>
            </div>
            <div className="history-item">
              <span>#[0003] · Oct 18</span>
              <span className="status-pill green">Delivered</span>
            </div>
            <button className="panel-link" type="button">
              View customer profile
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
