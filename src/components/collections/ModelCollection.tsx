import { useMemo, useState } from "react";
import { ModelCard } from "~/components/spaces/ModelCard";
import { Icon } from "~/components/workspace/Icon";
import { ModelSearchHit } from "~/modules/search_spaces/reducer";
import browse from "../spaces/SpacesIndex/browse.module.css";
import styles from "./collections.module.css";

export function CollectionAvatar({
  name,
  picture,
}: {
  name?: string;
  picture?: string;
}) {
  const [failed, setFailed] = useState<string | undefined>();
  return picture && picture !== failed ? (
    <img
      className={styles.avatar}
      src={picture}
      alt=""
      onError={() => setFailed(picture)}
      referrerPolicy="no-referrer"
    />
  ) : (
    <span className={styles.avatar} aria-hidden="true">
      {name
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "?"}
    </span>
  );
}

export function ModelCollection({
  models,
  showPrivacy = false,
  emptyTitle = "No models yet",
  emptyDescription = "Models will appear here once they’re created.",
}: {
  models: ModelSearchHit[];
  showPrivacy?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      models
        .filter((model) =>
          `${model.name || ""} ${model.description || ""}`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        )
        .sort(
          (a, b) =>
            (Date.parse(b.updated_at || "") || 0) -
            (Date.parse(a.updated_at || "") || 0)
        ),
    [models, query]
  );
  return (
    <div>
      {!!models.length && (
        <div className={styles.collectionTools}>
          <label className={styles.search}>
            <Icon name="search" />
            <span className={styles.srOnly}>Search these models</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search models"
            />
          </label>
          <span className={styles.count} role="status">
            {results.length} {results.length === 1 ? "model" : "models"}
          </span>
        </div>
      )}
      {results.length ? (
        <section className={browse.grid} aria-label="Models">
          {results.map((model) => (
            <ModelCard key={model.id} model={model} showPrivacy={showPrivacy} />
          ))}
        </section>
      ) : (
        <div className={styles.empty}>
          <Icon name="model" />
          <h2>{query.trim() ? "No matching models" : emptyTitle}</h2>
          <p>
            {query.trim()
              ? "Try a different name or keyword."
              : emptyDescription}
          </p>
          {query && (
            <button type="button" onClick={() => setQuery("")}>
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
