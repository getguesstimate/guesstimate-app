import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "~/modules/hooks";
import { Plan } from "~/lib/config/plan";
import { FieldHelp } from "~/components/workspace/FieldHelp";
import { AccountAccess } from "./AccountSettings";
import { createOrganization, inviteMember } from "./organizationActions";
import styles from "./account.module.css";

export function NewOrganization() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [plan, setPlan] = useState(6);
  const [created, setCreated] = useState<{ id: number; name: string } | null>(
    null
  );
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ email: string; added: boolean }[]>([]);
  const membersHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (created) membersHeading.current?.focus();
  }, [created]);
  const premium = Plan.find("organization_basic_30");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (inFlight.current || !name.trim()) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      setCreated(await dispatch(createOrganization(name.trim(), plan)));
    } catch {
      setError("Couldn’t create the organization. Please try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  const invite = async (event: FormEvent) => {
    event.preventDefault();
    if (!created || inFlight.current || !email.trim()) return;
    inFlight.current = true;
    setBusy(true);
    setError("");
    const address = email.trim();
    try {
      const added = await dispatch(inviteMember(created.id, address));
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
    <AccountAccess>
      <section className={`${styles.card} ${styles.organizationCard}`}>
        <ol className={styles.steps} aria-label="Organization setup">
          <li aria-current={!created ? "step" : undefined}>1. Organization</li>
          <li aria-current={created ? "step" : undefined}>2. Members</li>
        </ol>
        {!created ? (
          <form onSubmit={submit} className={styles.form}>
            <label className={styles.field}>
              Organization name
              <input
                required
                autoComplete="organization"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your organization"
                disabled={busy}
              />
            </label>
            <fieldset className={styles.plans}>
              <legend>Plan</legend>
              <label className={styles.planOption}>
                <input
                  type="radio"
                  name="organization-plan"
                  value="5"
                  checked={plan === 5}
                  onChange={() => setPlan(5)}
                  disabled={busy}
                />
                <span>
                  <strong>Free</strong>
                  <span>Unlimited members and public models</span>
                </span>
              </label>
              <label className={styles.planOption}>
                <input
                  type="radio"
                  name="organization-plan"
                  value="6"
                  checked={plan === 6}
                  onChange={() => setPlan(6)}
                  disabled={busy}
                />
                <span>
                  <strong>
                    Premium · ${premium.formattedCost()} / member / month
                  </strong>
                  <span>{premium.number()} private models</span>
                  <span>30-day free trial · No credit card needed</span>
                </span>
              </label>
            </fieldset>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <div className={styles.actions}>
              <button
                className={styles.primary}
                disabled={busy || !name.trim()}
              >
                {busy ? "Creating…" : "Create organization"}
              </button>
              <a className={styles.secondary} href="/models">
                Cancel
              </a>
            </div>
          </form>
        ) : (
          <div className={styles.form}>
            <div className={styles.cardHeading}>
              <h2 ref={membersHeading} tabIndex={-1}>
                {created.name}
              </h2>
              <FieldHelp label="About organization members">
                <p>
                  Members can see and edit the organization’s models. You can
                  invite more members from the organization page later.
                </p>
              </FieldHelp>
            </div>
            <p className={styles.muted} role="status">
              Organization created. Invite members or finish for now.
            </p>
            <form onSubmit={invite} className={styles.form}>
              <label className={styles.field}>
                Member email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  disabled={busy}
                />
              </label>
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
              <button
                className={styles.secondary}
                disabled={busy || !email.trim()}
              >
                {busy ? "Inviting…" : "Invite member"}
              </button>
            </form>
            <div className={styles.invitationList} aria-live="polite">
              {sent.map((invitation, index) => (
                <p key={`${invitation.email}-${index}`}>
                  {invitation.added ? "Added" : "Invitation sent to"}{" "}
                  {invitation.email}
                </p>
              ))}
            </div>
            <div className={styles.actions}>
              <a
                className={styles.primary}
                href={`/organizations/${created.id}`}
              >
                Finish
              </a>
            </div>
          </div>
        )}
      </section>
    </AccountAccess>
  );
}
