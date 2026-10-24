import { useState } from "react";
import { Icon } from "~/components/workspace/Icon";
import { ModelSearchHit } from "~/modules/search_spaces/reducer";
import { formatDescription } from "./shared";
import styles from "./SpacesIndex/browse.module.css";

export function ModelCard({
  model,
  showPrivacy = false,
}: {
  model: ModelSearchHit;
  showPrivacy?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [failedOwnerPicture, setFailedOwnerPicture] = useState<string | null>(
    null
  );
  const hasOrganization = !!model.organization_info?.id;
  const owner = hasOrganization ? model.organization_info : model.user_info;
  const ownerInitials =
    owner?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?";
  const ownerPath = hasOrganization ? "organizations" : "users";
  const date = model.updated_at ? new Date(model.updated_at) : null;
  const validDate = date && Number.isFinite(date.getTime()) ? date : null;
  return (
    <article className={styles.card}>
      <a href={`/models/${model.id}`} className={styles.modelLink}>
        <div className={styles.preview}>
          {showPrivacy && (
            <span className={styles.privacyBadge}>
              <Icon name={model.is_private ? "lock" : "globe"} />
              {model.is_private ? "Private" : "Public"}
            </span>
          )}
          {model.big_screenshot && !imageFailed ? (
            <img
              src={model.big_screenshot}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={styles.previewFallback} aria-hidden="true">
              <Icon name="model" />
              <span>Model preview</span>
            </div>
          )}
        </div>
        <div className={styles.cardText}>
          <h2>{model.name?.trim() || "Untitled model"}</h2>
          <p>
            {formatDescription(model.description || "") ||
              "No description added."}
          </p>
        </div>
      </a>
      <div className={styles.cardMeta}>
        {owner?.id ? (
          <a className={styles.owner} href={`/${ownerPath}/${owner.id}`}>
            {owner.picture && owner.picture !== failedOwnerPicture ? (
              <img
                className={styles.ownerAvatar}
                src={owner.picture}
                alt=""
                width="20"
                height="20"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setFailedOwnerPicture(owner.picture!)}
              />
            ) : (
              <span className={styles.ownerAvatar} aria-hidden="true">
                {ownerInitials}
              </span>
            )}
            <span>{owner.name || "View author"}</span>
          </a>
        ) : (
          <span>Public model</span>
        )}
        {validDate && (
          <time
            dateTime={validDate.toISOString()}
            title={`Updated ${validDate.toLocaleDateString("en", {
              dateStyle: "long",
            })}`}
          >
            {validDate.toLocaleDateString("en", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}
      </div>
    </article>
  );
}
