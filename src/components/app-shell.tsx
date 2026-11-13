"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "./icon";

const mainLinks = [
  { label: "Inbox", href: "/inbox", icon: "inbox" as const, count: "6" },
  { label: "Orders", href: "/orders", icon: "orders" as const },
  { label: "Live", href: "/live", icon: "live" as const },
  { label: "Customers", href: "/customers", icon: "customers" as const },
  { label: "Reports", href: "/reports", icon: "reports" as const },
];

const settingsLinks = [
  { label: "Channels", href: "/settings/channels" },
  { label: "Team", href: "/settings/team" },
  { label: "Saved replies", href: "/settings/saved-replies" },
  { label: "Business hours", href: "/settings/business-hours" },
  { label: "Billing", href: "/settings/billing" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLive = pathname.startsWith("/live");
  const isSettings = pathname.startsWith("/settings");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link aria-label="OneSync home" className="brand" href="/inbox">
          <span className="brand-mark">O</span>
          <span className="brand-name">OneSync</span>
        </Link>

        <div className="workspace-label">Workspace</div>
        <button className="workspace-switcher" type="button">
          <span className="workspace-dot" />
          <span>Casa Verde Shop</span>
          <span className="chevron">⌄</span>
        </button>

        <nav aria-label="Main navigation" className="primary-nav">
          {mainLinks.map((item) => {
            const active =
              item.href === "/live"
                ? isLive
                : pathname === item.href ||
                  (item.href === "/inbox" && pathname === "/");

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`nav-link${active ? " active" : ""}`}
                href={item.href}
                key={item.href}
              >
                <span className="nav-icon">
                  <Icon name={item.icon} size={18} />
                </span>
                <span>{item.label}</span>
                {item.count ? <span className="nav-badge">{item.count}</span> : null}
              </Link>
            );
          })}
        </nav>

        {isLive ? (
          <div className="settings-subnav" aria-label="Live menu">
            <Link
              className={`settings-link${pathname === "/live" ? " active" : ""}`}
              href="/live"
            >
              Claims
            </Link>
            <Link
              className={`settings-link${pathname === "/live/go-live" ? " active" : ""}`}
              href="/live/go-live"
            >
              Go live
            </Link>
          </div>
        ) : null}

        <div className="nav-caption">Workspace</div>
        <nav aria-label="Workspace settings" className="primary-nav">
          <Link
            aria-current={isSettings ? "page" : undefined}
            className={`nav-link${isSettings ? " active" : ""}`}
            href="/settings/channels"
          >
            <span className="nav-icon">
              <Icon name="settings" size={18} />
            </span>
            <span>Settings</span>
          </Link>
        </nav>

        {isSettings ? (
          <div className="settings-subnav" aria-label="Settings menu">
            {settingsLinks.map((item) => (
              <Link
                className={`settings-link${pathname === item.href ? " active" : ""}`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="sidebar-spacer" />
        <div className="plan-card">
          <div className="plan-title">Starter plan</div>
          <div className="plan-copy">3 of 5 connected accounts used</div>
          <div aria-label="58% of accounts used" className="plan-progress">
            <span />
          </div>
        </div>
        <div className="user-profile">
          <div className="profile-avatar">JM</div>
          <div>
            <div className="profile-name">Juan Mendoza</div>
            <div className="profile-role">Workspace owner</div>
          </div>
        </div>
      </aside>
      <main className="workspace">{children}</main>
    </div>
  );
}
