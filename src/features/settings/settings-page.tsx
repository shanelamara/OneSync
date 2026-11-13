import Link from "next/link";
import { SectionPage } from "../../components/section-page";

type SettingsSection =
  | "channels"
  | "team"
  | "saved-replies"
  | "business-hours"
  | "billing";

const settingLinks = [
  { href: "/settings/channels", label: "Channels", key: "channels" },
  { href: "/settings/team", label: "Team", key: "team" },
  { href: "/settings/saved-replies", label: "Saved replies", key: "saved-replies" },
  { href: "/settings/business-hours", label: "Business hours", key: "business-hours" },
  { href: "/settings/billing", label: "Billing", key: "billing" },
];

const headings: Record<SettingsSection, { title: string; description: string }> = {
  channels: {
    title: "Channels",
    description: "Connect the accounts whose messages you want to manage in OneSync.",
  },
  team: {
    title: "Team",
    description: "Manage workspace members, roles, and access.",
  },
  "saved-replies": {
    title: "Saved replies",
    description: "Create reusable responses for the questions your customers ask most.",
  },
  "business-hours": {
    title: "Business hours",
    description: "Set your schedule and let customers know when your team will reply.",
  },
  billing: {
    title: "Billing",
    description: "Manage your plan, usage, payment method, and invoices.",
  },
};

function SettingsTabs({ section }: { section: SettingsSection }) {
  return (
    <nav aria-label="Settings sections" className="settings-tabs">
      {settingLinks.map((item) => (
        <Link
          aria-current={section === item.key ? "page" : undefined}
          className={`settings-tab${section === item.key ? " active" : ""}`}
          href={item.href}
          key={item.key}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function ConnectedChannels() {
  const channels = [
    { mark: "FB", name: "Facebook", description: "[Your Page] · Facebook Page", tone: "" },
    { mark: "IG", name: "Instagram", description: "[@your handle] · Professional account", tone: "instagram" },
    { mark: "TT", name: "TikTok", description: "[@your handle] · Business account", tone: "tiktok" },
  ];

  return (
    <>
      <div className="settings-card content-card">
        <h2>Connected channels</h2>
        <p>Messages from connected accounts appear together in your inbox.</p>
        {channels.map((channel, index) => (
          <div className="channel-row" key={channel.mark}>
            <div className="channel-info">
              <span className={`channel-logo ${channel.tone}`}>{channel.mark}</span>
              <span>
                <span className="channel-name">{channel.name}</span>
                <span className="channel-caption">{channel.description}</span>
              </span>
            </div>
            {index === 2 ? (
              <button className="button-secondary" type="button">Reconnect</button>
            ) : (
              <span className="status-pill green">Connected</span>
            )}
          </div>
        ))}
      </div>
      <div className="page-actions">
        <button className="button-secondary" type="button">Connect Facebook</button>
        <button className="button-secondary" type="button">Connect Instagram</button>
        <button className="button-secondary" type="button">Connect TikTok</button>
      </div>
    </>
  );
}

function TeamSettings() {
  return (
    <SectionPage
      cardTitle="Team members"
      columns={["Name", "Email", "Role", "Status", "Actions"]}
      description="Invite teammates and choose what they can manage."
      primaryAction="Invite member"
      rows={[
        ["Juan Mendoza", "juan@example.com", "Owner", "Active", "—"],
        ["Maria Reyes", "maria@example.com", "Admin", "Active", "Remove"],
        ["Paolo Cruz", "paolo@example.com", "Agent", "Invited", "Resend"],
      ]}
      title="Team"
      embedded
    />
  );
}

function SavedReplies() {
  return (
    <SectionPage
      cardTitle="Saved replies"
      columns={["Title", "Shortcut", "Message preview", "Updated"]}
      description="Keep frequently used replies consistent and quick to send."
      primaryAction="New reply"
      rows={[
        ["GCash details", "/gcash", "Hi [Customer name]! Ito po ang GCash details namin…", "Today"],
        ["Shipping fees", "/shipping", "Shipping fee depends on your location…", "Yesterday"],
        ["Size chart", "/size", "Here po ang size guide namin…", "Oct 22"],
        ["Order summary", "/summary", "Thank you po! Ito ang summary ng order ninyo…", "Oct 20"],
        ["Away message", "/away", "Salamat sa message. Sasagutin ka namin pagbukas ng shop.", "Oct 18"],
      ]}
      title="Saved replies"
      embedded
    />
  );
}

function BusinessHours() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (
    <div className="settings-card content-card">
      <h2>Business hours</h2>
      <p>Timezone: Asia/Manila (UTC+8)</p>
      {days.map((day, index) => (
        <div className="setting-row" key={day}>
          <label className="check-row">
            <input defaultChecked={index < 6} type="checkbox" />
            {day}
          </label>
          {index < 6 ? (
            <span style={{ color: "#686c65", fontSize: 10 }}>09:00 AM&nbsp; – &nbsp;06:00 PM</span>
          ) : (
            <span style={{ color: "#a0a29b", fontSize: 10 }}>Closed</span>
          )}
        </div>
      ))}
      <div className="form-field" style={{ marginTop: 18 }}>
        <label htmlFor="away-message">Away message (sent outside business hours)</label>
        <textarea
          defaultValue="Hi! Salamat sa message. Sarado pa kami ngayon, pero sasagutin ka namin pagbukas ng shop."
          id="away-message"
        />
      </div>
      <div className="page-actions" style={{ marginTop: 14 }}>
        <button className="button-primary" type="button">Save hours</button>
        <button className="button-secondary" type="button">Add holiday closure</button>
      </div>
    </div>
  );
}

function Billing() {
  return (
    <>
      <div className="metric-grid">
        {[
          ["Connected accounts", "3 of 5"],
          ["Team members", "3 of 5"],
          ["Live sessions", "4 of 10"],
          ["Next invoice", "Dec 1"],
        ].map(([label, value]) => (
          <div className="metric-card" key={label}>
            <div className="metric-label">{label}</div>
            <div className="metric-value" style={{ fontSize: 19 }}>{value}</div>
          </div>
        ))}
      </div>
      <div className="content-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Your plan · Starter</h2>
            <div className="card-subtitle">Affordable tools for your growing shop</div>
          </div>
          <button className="button-secondary" type="button">Manage plan</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: 15 }}>
          {["Starter", "Growth", "Team"].map((plan, index) => (
            <div className="customer-card" key={plan}>
              <div className="channel-name">{plan}</div>
              <div className="metric-value" style={{ fontSize: 20 }}>
                {index === 0 ? "₱499" : index === 1 ? "₱1,299" : "₱2,499"}
              </div>
              <div className="channel-caption">per month</div>
              <div className="channel-caption" style={{ marginTop: 10 }}>
                {index === 0 ? "5 accounts · 5 team members" : index === 1 ? "10 accounts · 10 team members" : "Unlimited team members"}
              </div>
              <button className="panel-link" type="button">
                {index === 0 ? "Current plan" : "Choose plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <SectionPage
        cardTitle="Invoices"
        columns={["Date", "Amount", "Status", ""]}
        description="Recent invoices and payment history."
        rows={[
          ["Nov 1, 2026", "₱499", "Paid", "Download"],
          ["Oct 1, 2026", "₱499", "Paid", "Download"],
        ]}
        title="Invoices"
        embedded
      />
    </>
  );
}

export function SettingsPage({ section }: { section: SettingsSection }) {
  const heading = headings[section];
  const actionLabels: Partial<Record<SettingsSection, string>> = {
    channels: "Connect account",
    team: "Invite member",
    "saved-replies": "New reply",
  };
  return (
    <div className="page-content">
      <header className="page-heading">
        <div>
          <h1 className="page-title">{heading.title}</h1>
          <p className="page-description">{heading.description}</p>
        </div>
        {actionLabels[section] ? (
          <button className="button-primary" type="button">
            {actionLabels[section]}
          </button>
        ) : null}
      </header>
      <div className="settings-layout">
        <SettingsTabs section={section} />
        <div>
          {section === "channels" ? <ConnectedChannels /> : null}
          {section === "team" ? <TeamSettings /> : null}
          {section === "saved-replies" ? <SavedReplies /> : null}
          {section === "business-hours" ? <BusinessHours /> : null}
          {section === "billing" ? <Billing /> : null}
          {section === "channels" ? (
            <div className="notice" style={{ marginTop: 14 }}>
              Connect official business accounts to sync messages. OneSync never asks for
              your personal social account password.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
