import { AccountShell } from "~/components/account/AccountShell";
import { AccountSettingsContent } from "~/components/account/AccountSettings";
import styles from "../components/account/account.module.css";
export default function SettingsPage() {
  return (
    <AccountShell title="Account settings">
      <section className={`${styles.card} ${styles.organizationCard}`}>
        <AccountSettingsContent />
      </section>
    </AccountShell>
  );
}
