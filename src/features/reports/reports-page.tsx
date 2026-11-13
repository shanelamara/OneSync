import { SectionPage } from "../../components/section-page";

const channelData = [
  { channel: "Facebook", value: "60%", width: "60%", className: "facebook" },
  { channel: "Instagram", value: "28%", width: "28%", className: "instagram" },
  { channel: "TikTok", value: "12%", width: "12%", className: "tiktok" },
];

export function ReportsPage() {
  return (
    <SectionPage
      cardTitle="Team performance"
      columns={["Team member", "Replied", "Avg. response", "Resolved"]}
      description="A snapshot of conversations, sales, and team response times."
      metrics={[
        { label: "First response time", value: "4 min", note: "↓ 18% vs. last period" },
        { label: "Unanswered messages", value: "6" },
        { label: "Orders", value: "28", note: "This month" },
        { label: "Live claims", value: "41", note: "This month" },
      ]}
      primaryAction="Export CSV"
      rows={[
        ["Owner", "96", "3 min", "71"],
        ["Agent 1", "142", "5 min", "118"],
        ["Agent 2", "88", "7 min", "60"],
      ]}
      title="Reports"
    >
      <section className="content-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Messages by platform</h2>
            <div className="card-subtitle">Channel share · Last 7 days</div>
          </div>
          <button className="button-secondary" type="button">Last 7 days</button>
        </div>
        <div style={{ display: "grid", gap: 16, padding: 18 }}>
          {channelData.map((item) => (
            <div key={item.channel}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                <span>{item.channel}</span><strong>{item.value}</strong>
              </div>
              <div className="plan-progress" style={{ height: 7, marginTop: 7 }}>
                <span style={{ width: item.width }} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="notice">
        <strong>Top customer questions:</strong> Price (magkano), availability and sizes,
        shipping fee, payment options.
      </div>
      <div className="notice">
        <strong>Latest live session:</strong> Spring arrivals · 41 claims · 6 buyers waiting
        for payment.
      </div>
    </SectionPage>
  );
}
