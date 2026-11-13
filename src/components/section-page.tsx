import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "./icon";

export type SectionMetric = {
  label: string;
  value: string;
  note?: string;
};

export type SectionPageProps = {
  title: string;
  description: string;
  primaryAction?: string;
  primaryHref?: string;
  secondaryAction?: string;
  secondaryHref?: string;
  metrics?: SectionMetric[];
  columns: string[];
  rows: string[][];
  cardTitle?: string;
  notice?: string;
  children?: ReactNode;
  embedded?: boolean;
};

function getStatusTone(value: string) {
  const label = value.toLowerCase();
  if (
    label.includes("paid") ||
    label.includes("confirmed") ||
    label.includes("connected") ||
    label.includes("active") ||
    label.includes("delivered")
  ) {
    return "green";
  }
  if (
    label.includes("pending") ||
    label.includes("review") ||
    label.includes("failed") ||
    label.includes("attention")
  ) {
    return "orange";
  }
  if (label.includes("shipped") || label.includes("invited")) return "blue";
  return "";
}

export function SectionPage({
  title,
  description,
  primaryAction,
  primaryHref,
  secondaryAction,
  secondaryHref,
  metrics,
  columns,
  rows,
  cardTitle,
  notice,
  children,
  embedded = false,
}: SectionPageProps) {
  const statusColumn =
    columns.findIndex((column) => column.toLowerCase() === "status");

  return (
    <div className={`page-content${embedded ? " embedded" : ""}`}>
      {!embedded ? (
        <header className="page-heading">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-description">{description}</p>
          </div>
          <div className="page-actions">
            {secondaryAction ? (
              secondaryHref ? (
                <Link className="button-secondary" href={secondaryHref}>
                  {secondaryAction}
                </Link>
              ) : (
                <button className="button-secondary" type="button">
                  {secondaryAction}
                </button>
              )
            ) : null}
            {primaryAction ? (
              primaryHref ? (
                <Link className="button-primary" href={primaryHref}>
                  <Icon name="plus" size={14} />
                  {primaryAction}
                </Link>
              ) : (
                <button className="button-primary" type="button">
                  <Icon name="plus" size={14} />
                  {primaryAction}
                </button>
              )
            ) : null}
          </div>
        </header>
      ) : null}

      {!embedded && notice ? <div className="notice">{notice}</div> : null}

      {!embedded && metrics?.length ? (
        <section aria-label="Summary metrics" className="metric-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-value">{metric.value}</div>
              {metric.note ? <div className="metric-note">{metric.note}</div> : null}
            </article>
          ))}
        </section>
      ) : null}

      <section className="content-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{cardTitle ?? title}</h2>
            <div className="card-subtitle">
              {rows.length} {rows.length === 1 ? "record" : "records"}
            </div>
          </div>
          <button aria-label="More options" className="icon-button" type="button">
            <Icon name="more" size={16} />
          </button>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row, rowIndex) => (
                  <tr key={`${row[0]}-${rowIndex}`}>
                    {row.map((cell, cellIndex) => {
                      const tone = cellIndex === statusColumn ? getStatusTone(cell) : "";
                      return (
                        <td key={`${cell}-${cellIndex}`}>
                          {tone ? <span className={`status-pill ${tone}`}>{cell}</span> : cell}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="empty-results" colSpan={columns.length}>
                    Nothing to show yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {children}
    </div>
  );
}
