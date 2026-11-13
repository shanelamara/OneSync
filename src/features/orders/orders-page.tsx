import { SectionPage } from "../../components/section-page";

export function OrdersPage() {
  return (
    <SectionPage
      cardTitle="Recent orders"
      columns={["Order", "Customer", "Items", "Total", "Status", "Courier"]}
      description="Review order details, payment status, and delivery progress."
      metrics={[
        { label: "Orders today", value: "28", note: "+12% from yesterday" },
        { label: "Pending payment", value: "6" },
        { label: "To pack", value: "9" },
        { label: "Needs attention", value: "2" },
      ]}
      primaryAction="New order"
      rows={[
        ["#0012", "Maria Santos", "Floral dress #12", "₱450", "Pending payment", "Not shipped"],
        ["#0011", "@jaycee.finds", "Floral dress #12", "₱450", "Paid · to pack", "Not shipped"],
        ["#0010", "Liza Ramos", "Floral dress, Linen top", "₱890", "Packed", "J&T · Label ready"],
        ["#0009", "Ana Dela Cruz", "Linen top #07", "₱520", "Shipped", "LBC · In transit"],
        ["#0008", "Ken Villanueva", "Linen top #07", "₱520", "Delivered", "Flash Express"],
        ["#0007", "Joy Aquino", "Floral dress #12", "₱450", "Delivery failed", "J&T · Retry needed"],
      ]}
      secondaryAction="Export CSV"
      title="Orders"
    />
  );
}
