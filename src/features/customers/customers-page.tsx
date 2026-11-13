import { SectionPage } from "../../components/section-page";

export function CustomersPage() {
  return (
    <SectionPage
      cardTitle="Customer directory"
      columns={["Customer", "Channels", "Orders", "Last message", "Tags"]}
      description="See customer history and connected social accounts in one place."
      primaryAction="Add customer"
      rows={[
        ["Maria Santos", "Facebook · Instagram", "3", "2m ago", "Repeat buyer"],
        ["@jaycee.finds", "Instagram", "1", "8m ago", "New"],
        ["Ana Dela Cruz", "TikTok", "2", "15m ago", "Cebu"],
        ["Liza Ramos", "Facebook", "4", "24m ago", "VIP"],
        ["Joy Aquino", "Facebook", "1", "2h ago", "COD"],
        ["Ken Villanueva", "Instagram", "2", "1d ago", "Repeat buyer"],
      ]}
      secondaryAction="Import"
      title="Customers"
    />
  );
}
