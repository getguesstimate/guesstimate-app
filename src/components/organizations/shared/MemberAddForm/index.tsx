import { FormEvent, useRef, useState } from "react";
import { useAppDispatch } from "~/modules/hooks";
import { inviteMember } from "~/components/account/organizationActions";
import styles from "../../../account/account.module.css";

export function MemberAddForm({ organizationId }: { organizationId: number }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ email: string; added: boolean }[]>([]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (inFlight.current || !email.trim()) return;
    const address = email.trim();
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const added = await dispatch(inviteMember(organizationId, address));
      setSent((previous) => [{ email: address, added }, ...previous]);
      setEmail("");
    } catch {
      setError(
        "Couldn’t invite this member. Check the email address and try again."
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  return (
    <div className={styles.form}>
      <form onSubmit={submit} className={styles.form}>
        <label className={styles.field}>
          Member email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            disabled={busy}
          />
        </label>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <button className={styles.primary} disabled={busy || !email.trim()}>
          {busy ? "Inviting…" : "Invite member"}
        </button>
      </form>
      <div className={styles.invitationList} aria-live="polite">
        {sent.map((item, index) => (
          <p key={`${item.email}-${index}`}>
            {item.added ? "Added" : "Invitation sent to"} {item.email}
          </p>
        ))}
      </div>
    </div>
  );
}
