import { AccountShell } from "~/components/account/AccountShell";
import { Billing } from "~/components/account/Billing";
export default function BillingPage() {
  return (
    <AccountShell
      wide
      title="Billing"
      description="Your plan and payment details."
    >
      <Billing />
    </AccountShell>
  );
}
