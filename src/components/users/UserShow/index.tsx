import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AccountShell } from "~/components/account/AccountShell";
import {
  CollectionAvatar,
  ModelCollection,
} from "~/components/collections/ModelCollection";
import { loadUserCollection } from "~/components/collections/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";
import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";
import styles from "../../account/account.module.css";

export function UserShow({ userId }: { userId: number }) {
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.me);
  const { status } = useSession();
  const [data, setData] = useState<{
    user: ApiUser;
    models: ApiSpace[];
  } | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const isMe = me.profile?.id === userId;
  useEffect(() => {
    if (status === "loading" || me.tag === "SIGNED_IN_LOADING_PROFILE") return;
    let active = true;
    setData(null);
    setError(false);
    dispatch(loadUserCollection(userId))
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [dispatch, userId, status, me.tag, me.profile?.id, retry]);
  return (
    <AccountShell
      wide
      title={isMe ? "My models" : data?.user.name || "Models"}
      description={
        isMe
          ? "Your public and private models."
          : "Public models shared by this author."
      }
      avatar={
        data && (
          <CollectionAvatar name={data.user.name} picture={data.user.picture} />
        )
      }
    >
      {error ? (
        <section className={styles.card} role="alert">
          <h2>Models couldn’t be loaded</h2>
          <button
            className={styles.secondary}
            onClick={() => setRetry((value) => value + 1)}
          >
            Retry
          </button>
        </section>
      ) : !data ? (
        <p className={styles.muted} role="status">
          Loading models…
        </p>
      ) : (
        <ModelCollection
          showPrivacy={isMe}
          models={data.models.map((model) => ({
            ...model,
            objectID: String(model.id),
            updated_at: (model as any).updated_at,
            user_info: model._embedded?.user || data.user,
            organization_info: model._embedded?.organization,
          }))}
          emptyDescription={
            isMe
              ? "Create a model to start your next estimate."
              : "This author hasn’t shared any public models yet."
          }
        />
      )}
    </AccountShell>
  );
}
