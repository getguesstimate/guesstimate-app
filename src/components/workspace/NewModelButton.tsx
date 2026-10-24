import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import account from "../account/account.module.css";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { usersOrganizations } from "~/lib/engine/user";
import { create } from "~/modules/spaces/actions";
import { Icon } from "./Icon";
import styles from "./navigation.module.css";

export function NewModelButton({
  organizationId,
  inMenu = false,
}: {
  organizationId?: number;
  inMenu?: boolean;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const me = useAppSelector((state) => state.me);
  const memberships = useAppSelector(
    (state) => state.userOrganizationMemberships
  );
  const allOrganizations = useAppSelector((state) => state.organizations);
  const creating = useAppSelector((state) => state.canvasState.actionState);
  const organizations = usersOrganizations(me, memberships, allOrganizations);
  const [attempted, setAttempted] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);
  const [query, setQuery] = useState("");
  const search = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const useDialog = organizationId === undefined && organizations.length > 5;
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => { setChooserOpen(false); }, [router.asPath]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (details.current && !details.current.contains(event.target as Node))
        details.current.open = false;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && details.current?.open) {
        details.current.open = false;
        details.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  if (me.tag !== "SIGNED_IN") return null;
  const newModel = (owner?: number) => {
    if (creating === "CREATING") return;
    if (chooserOpen) search.current?.focus();
    if (details.current) {
      details.current.open = false;
      details.current.querySelector("summary")?.focus();
    }
    setAttempted(true);
    dispatch(create(owner, router));
  };
  return (
    <div className={`${styles.newModel} ${inMenu ? styles.inMenu : ""}`}>
      {useDialog ? (
        <button
          ref={trigger}
          type="button"
          className={styles.createButton}
          onClick={() => {
            setQuery("");
            setChooserOpen(true);
          }}
        >
          <Icon name="plus" />
          New model
        </button>
      ) : organizationId === undefined && organizations.length > 0 ? (
        <details ref={details}>
          <summary className={styles.createButton}>
            <Icon name="plus" />
            {creating === "CREATING" ? "Creating…" : "New model"}
          </summary>
          <div className={styles.ownerMenu}>
            <button
              type="button"
              disabled={creating === "CREATING"}
              onClick={() => newModel()}
            >
              Personal model
            </button>
            {organizations.map((org) => (
              <button
                key={org.id}
                type="button"
                disabled={creating === "CREATING"}
                onClick={() => newModel(org.id)}
              >
                {org.name}
              </button>
            ))}
          </div>
        </details>
      ) : (
        <button
          type="button"
          className={styles.createButton}
          disabled={creating === "CREATING"}
          onClick={() => newModel(organizationId)}
        >
          <Icon name="plus" />
          {creating === "CREATING" ? "Creating…" : "New model"}
        </button>
      )}
      <Modal
        isOpen={chooserOpen}
        onRequestClose={() => setChooserOpen(false)}
        onAfterOpen={() => search.current?.focus()}
        onAfterClose={() => trigger.current?.focus()}
        appElement={
          typeof document !== "undefined"
            ? document.getElementById("__next") || undefined
            : undefined
        }
        contentLabel="New model"
        data={{ "model-owner-dialog": "true" }}
        className={account.dialog}
        overlayClassName={account.overlay}
        bodyOpenClassName={account.modalOpen}
      >
        <div className={account.dialogHeading}>
          <h2>New model</h2>
          <button
            type="button"
            className={account.close}
            aria-label="Close new model"
            onClick={() => setChooserOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        <button
          type="button"
          className={styles.ownerChoice}
          disabled={creating === "CREATING"}
          onClick={() => newModel()}
        >
          Personal model
        </button>
        <label className={account.field}>
          Organizations
          <input
            ref={search}
            type="search"
            placeholder="Search organizations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className={styles.ownerResults}>
          {organizations
            .filter((org) =>
              org.name?.toLowerCase().includes(query.trim().toLowerCase())
            )
            .map((org) => (
              <button
                type="button"
                key={org.id}
                className={styles.ownerChoice}
                disabled={creating === "CREATING"}
                onClick={() => newModel(org.id)}
              >
                {org.name}
              </button>
            ))}
          {!organizations.some((org) =>
            org.name?.toLowerCase().includes(query.trim().toLowerCase())
          ) && <p role="status">No matching organizations</p>}
        </div>
        {creating === "CREATING" && <p role="status">Creating model…</p>}
        {attempted && creating === "ERROR_CREATING" && (
          <p role="alert" className={account.error}>
            Couldn’t create the model. Please try again.
          </p>
        )}
      </Modal>
      {!chooserOpen && attempted && creating === "ERROR_CREATING" && (
        <p role="alert" className={styles.error}>
          Couldn’t create the model. Please try again.
        </p>
      )}
    </div>
  );
}
