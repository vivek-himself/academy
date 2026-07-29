import StubPage from "../../components/StubPage";

export default function PaymentsPage() {
  return (
    <StubPage
      title="Payments & Orders"
      subtitle="Track course purchases and revenue"
      needs="Connect a payment provider (Stripe, Razorpay, etc.) — you'll need to create an account with them and add their API keys. Once connected, orders and revenue will show up here automatically."
    />
  );
}
