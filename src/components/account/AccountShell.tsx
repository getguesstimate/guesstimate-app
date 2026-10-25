import { ReactNode } from "react";
import Head from "next/head";
import { PageHeader } from "~/components/workspace/PageHeader";
import { NavHelper } from "~/components/utility/NavHelper";
import { ErrorModal } from "~/components/layout/ErrorModal";
import { ModalContainer } from "~/modules/modal/routes";
import styles from "./account.module.css";

export function AccountShell({
  title,
  description,
  children,
  actions,
  avatar,
  wide = false,
  newModelOrganizationId,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  avatar?: ReactNode;
  wide?: boolean;
  newModelOrganizationId?: number;
}) {
  return (
    <NavHelper>
      <div className={styles.page}>
        <Head>
          <title key="title">{title} — Guesstimate</title>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
        </Head>
        <ErrorModal />
        <ModalContainer />
        <PageHeader
          className={styles.header}
          organizationId={newModelOrganizationId}
        />
        <main className={`${styles.main} ${wide ? styles.wide : ""}`}>
          <div className={styles.pageHeading}>
            {avatar}
            <div className={styles.headingText}>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            {actions && <div className={styles.headingActions}>{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </NavHelper>
  );
}
