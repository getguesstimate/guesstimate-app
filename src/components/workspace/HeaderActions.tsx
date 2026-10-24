import { useAppSelector } from "~/modules/hooks";
import { AccountMenu } from "./AccountMenu";
import { NewModelButton } from "./NewModelButton";
import styles from "./navigation.module.css";

export function HeaderActions({
  callbackUrl = "/models",
  organizationId,
  workspace = false,
}: {
  callbackUrl?: string;
  organizationId?: number;
  workspace?: boolean;
}) {
  const me = useAppSelector((state) => state.me);
  return (
    <div
      className={`${styles.actions} ${
        workspace ? styles.workspaceActions : ""
      }`}
    >
      {me.tag === "SIGNED_IN" && !workspace && (
        <>
          <a className={styles.myModels} href={`/users/${me.profile.id}`}>
            My models
          </a>
          <div className={styles.create}>
            <NewModelButton organizationId={organizationId} />
          </div>
        </>
      )}
      <AccountMenu
        callbackUrl={callbackUrl}
        showMyModels={workspace ? true : "mobile"}
      />
    </div>
  );
}
