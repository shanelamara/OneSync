import { Icon } from "../../components/icon";
import { SectionPage } from "../../components/section-page";

export function LiveClaimsPage() {
  return (
    <SectionPage
      description="Capture claim comments and turn them into orders while you stream."
      primaryAction="New session"
      secondaryAction="Open studio"
      secondaryHref="/live/go-live"
      notice={
        "Live now: Spring arrivals · Facebook · Claim words: mine, steal, #item code"
      }
      cardTitle="Live claims"
      columns={["Customer", "Item", "Qty", "Time", "Status", "Actions"]}
      metrics={[
        { label: "Claims", value: "41", note: "Across 3 connected channels" },
        { label: "Buyers", value: "18" },
        { label: "Awaiting payment", value: "6" },
        { label: "Needs review", value: "1" },
      ]}
      rows={[
        ["Maria Santos", "Floral dress #12 (M)", "1", "20:14", "Confirmed", "Edit"],
        ["Liza Ramos", "Floral dress #12 (M)", "1", "20:15", "Confirmed", "Edit"],
        ["@jaycee.finds", "Floral dress #12 (M)", "1", "20:16", "Waitlist", "Edit"],
        ["Ken Villanueva", "Linen top #07 (S)", "1", "20:21", "Confirmed", "Edit"],
        ["Joy Aquino", "Linen top #07 (S)", "2", "20:22", "Waitlist", "Edit"],
        ["@mikaela.shop", "Item not recognized", "?", "20:24", "Needs review", "Review"],
      ]}
      title="Live selling"
    >
      <section className="content-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Live comments</h2>
            <div className="card-subtitle">Auto-parsed from your connected live</div>
          </div>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <tbody>
              <tr>
                <td>20:24 · @mikaela.shop</td>
                <td>mine po pero size L?</td>
                <td><span className="status-pill orange">Needs review</span></td>
              </tr>
              <tr>
                <td>20:22 · Joy Aquino</td>
                <td>steal #07 x2</td>
                <td><span className="status-pill green">Claim captured</span></td>
              </tr>
              <tr>
                <td>20:21 · Ken Villanueva</td>
                <td>mine #07</td>
                <td><span className="status-pill green">Claim captured</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </SectionPage>
  );
}

export function GoLivePage() {
  return (
    <div className="page-content">
      <header className="page-heading">
        <div>
          <h1 className="page-title">Go live</h1>
          <p className="page-description">
            Set up a stream and manage connected channels from one studio.
          </p>
        </div>
        <button className="button-primary" type="button">
          Go live on 3 platforms
        </button>
      </header>
      <div className="live-grid">
        <section className="content-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Stream preview</h2>
              <div className="card-subtitle">Session name: Spring arrivals</div>
            </div>
            <span className="status-pill">Offline</span>
          </div>
          <div style={{ padding: 14 }}>
            <div className="live-preview">
              <span className="live-preview-icon">
                <Icon name="camera" size={20} />
              </span>
              <strong>Camera preview</strong>
              <p>Connect a camera to see your stream preview</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="button-secondary" type="button">Mic on</button>
              <button className="button-secondary" type="button">Camera on</button>
              <button className="button-secondary" type="button">Share screen</button>
            </div>
          </div>
        </section>
        <section className="content-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Stream destinations</h2>
              <div className="card-subtitle">Choose where to broadcast</div>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <label className="check-row">
              <input defaultChecked type="checkbox" />
              Facebook · [Your Page]
              <span className="status-pill green" style={{ marginLeft: "auto" }}>Ready</span>
            </label>
            <label className="check-row">
              <input defaultChecked type="checkbox" />
              Instagram · [your handle]
              <span className="status-pill orange" style={{ marginLeft: "auto" }}>Needs stream key</span>
            </label>
            <label className="check-row">
              <input defaultChecked type="checkbox" />
              TikTok · [your handle]
              <span className="status-pill orange" style={{ marginLeft: "auto" }}>Needs stream key</span>
            </label>
            <div className="notice" style={{ marginTop: 18 }}>
              Platforms decide who can go live. Accounts without access need a stream key or approval first.
            </div>
          </div>
        </section>
      </div>
      <section className="content-card" style={{ marginTop: 14 }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Products to pin</h2>
            <div className="card-subtitle">Products shown alongside your live video</div>
          </div>
          <button className="button-secondary" type="button">Add product</button>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <tbody>
              <tr><td>Floral dress #12</td><td>Size M</td><td>₱450</td><td>2 left</td></tr>
              <tr><td>Linen top #07</td><td>Size S</td><td>₱520</td><td>1 left</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="content-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Combined live chat</h2>
            <div className="card-subtitle">Claims are added to the order list</div>
          </div>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <tbody>
              <tr><td>FB · Liza Ramos</td><td>mine po! #12</td><td><button className="button-secondary" type="button">Send</button></td></tr>
              <tr><td>IG · @jaycee.finds</td><td>mine #12</td><td><button className="button-secondary" type="button">Send</button></td></tr>
              <tr><td>TT · @mikaela.shop</td><td>Do you ship outside Metro Manila?</td><td><button className="button-secondary" type="button">Send</button></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
