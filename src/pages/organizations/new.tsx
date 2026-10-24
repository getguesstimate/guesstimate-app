import { AccountShell } from "~/components/account/AccountShell";
import { NewOrganization } from "~/components/account/NewOrganization";
export default function NewOrganizationPage() {
  return (
    <AccountShell
      title="New organization"
      description="A shared place for your team’s models."
    >
      <NewOrganization />
    </AccountShell>
  );
}
