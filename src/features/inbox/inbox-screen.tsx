"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Icon } from "../../components/icon";

type Message = {
  id: string;
  direction: "incoming" | "outgoing";
  text: string;
  time: string;
  createdAt: string;
  deliveryStatus: string;
};

type Conversation = {
  id: string;
  customerId: string;
  initials: string;
  name: string;
  channel: "FB" | "IG" | "TT";
  channelName: string;
  channelHandle: string;
  channelStatus: string;
  time: string;
  lastMessageAt: string;
  preview: string;
  tags: string[];
  mine: boolean;
  assignedToId: string | null;
  needsReply: boolean;
  order: boolean;
  status: "OPEN" | "PENDING" | "RESOLVED";
  messages: Message[];
};

const filters = ["All", "Unassigned", "Mine", "Needs reply", "Orders"];

function localTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Manila",
  }).format(date instanceof Date ? date : new Date(date));
}

export function InboxScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [showConversation, setShowConversation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/inbox")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error?.message ?? "Could not load inbox.");
        }
        return result.data as Conversation[];
      })
      .then((rows) => {
        if (!active) return;
        setConversations(rows);
        setActiveId((current) =>
          rows.some((conversation) => conversation.id === current)
            ? current
            : rows[0]?.id ?? "",
        );
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Could not load inbox.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

  async function updateActiveConversation(
    update: { status?: Conversation["status"]; assignToOwner?: boolean },
  ) {
    if (!activeConversation) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/conversations/${activeConversation.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Could not update conversation.");
      const saved = result.data as Conversation;
      setConversations((current) =>
        current.map((conversation) => (conversation.id === saved.id ? saved : conversation)),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update conversation.");
    } finally {
      setSaving(false);
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || !activeConversation) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/conversations/${activeConversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: message }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? "Could not save reply.");
      const savedMessage = result.data as Message;
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === activeConversation.id
            ? {
                ...conversation,
                preview: savedMessage.text,
                time: "now",
                lastMessageAt: savedMessage.createdAt,
                needsReply: false,
                messages: [
                  ...conversation.messages,
                  { ...savedMessage, time: localTime(savedMessage.createdAt) },
                ],
              }
            : conversation,
        ),
      );
      setDraft("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save reply.");
    } finally {
      setSaving(false);
    }
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
              disabled={saving}
              onClick={() => void updateActiveConversation({ assignToOwner: true })}
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
                if (status === "OPEN" || status === "PENDING" || status === "RESOLVED") {
                  updateActiveConversation({ status });
                }
              }}
              value={activeConversation.status}
            >
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div aria-live="polite" className="thread">
            <div className="thread-date">Today</div>
            {activeConversation.messages.map((message, index) => (
              <div className={`message ${message.direction}`} key={message.id}>
                <div className="message-bubble">{message.text}</div>
                <div className="message-time">{message.time}</div>
                {message.deliveryStatus === "LOCAL_ONLY" ? (
                  <div className="message-time">Saved locally; not sent to {activeConversation.channelName}.</div>
                ) : null}
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
              <button className="send-button" disabled={saving} type="submit">
                {saving ? "Saving..." : "Send"} <Icon name="send" size={13} />
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
