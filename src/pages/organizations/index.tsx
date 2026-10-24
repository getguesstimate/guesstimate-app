import { useEffect, useState } from "react";
import { AccountShell } from "~/components/account/AccountShell";
import { AccountAccess } from "~/components/account/AccountSettings";
import { CollectionAvatar } from "~/components/collections/ModelCollection";
import { loadMyOrganizations } from "~/components/collections/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import account from "../../components/account/account.module.css";
import styles from "../../components/collections/collections.module.css";

function OrganizationList() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.me.profile?.id);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    status: "loading" | "ready" | "error";
    organizations: { id: number; name: string; picture?: string }[];
  }>({ status: "loading", organizations: [] });

  useEffect(() => {
    if (!userId) return;
    let active = true;
    setResult({ status: "loading", organizations: [] });
    dispatch(loadMyOrganizations(userId))
      .then((organizations) => {
        if (active) setResult({ status: "ready", organizations });
      })
      .catch(() => {
        if (active) setResult({ status: "error", organizations: [] });
      });
    return () => {
      active = false;
    };
  }, [userId, attempt, dispatch]);

  if (result.status === "loading")
    return <p role="status">Loading organizations…</p>;
  if (result.status === "error")
    return (
      <div className={styles.empty}>
        <p role="alert">Couldn’t load your organizations.</p>
        <button type="button" onClick={() => setAttempt(attempt + 1)}>
          Try again
        </button>
      </div>
    );
  if (!result.organizations.length)
    return (
      <div className={styles.empty}>
        <h2>No organizations yet</h2>
        <p>You aren’t a member of any organizations.</p>
      </div>
    );
  return (
    <ul className={styles.organizationList} aria-label="Your organizations">
      {result.organizations.map((organization) => (
        <li key={organization.id}>
          <a
            className={styles.organizationLink}
            href={`/organizations/${organization.id}`}
          >
            <CollectionAvatar
              name={organization.name}
              picture={organization.picture}
            />
            <span>{organization.name || "Unnamed organization"}</span>
            <span aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function OrganizationsPage() {
  const signedIn = useAppSelector((state) => state.me.tag === "SIGNED_IN");
  return (
    <AccountShell
      title="Organizations"
      actions={
        signedIn && (
          <a className={account.primary} href="/organizations/new">
            New organization
          </a>
        )
      }
    >
      <AccountAccess>
        <OrganizationList />
      </AccountAccess>
    </AccountShell>
  );
}
