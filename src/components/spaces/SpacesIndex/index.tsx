import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Modal from "react-modal";
import { useRouter } from "next/router";
import { PageHeader } from "~/components/workspace/PageHeader";
import { Icon } from "~/components/workspace/Icon";
import { ErrorModal } from "~/components/layout/ErrorModal";
import { ModalContainer } from "~/modules/modal/routes";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as search from "~/modules/search_spaces/actions";
import { SearchSortBy } from "~/modules/search_spaces/actions";
import { ModelCard } from "../ModelCard";
import { usersOrganizations } from "~/lib/engine/user";
import styles from "./browse.module.css";

export function SpacesIndex() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const results = useAppSelector((state) => state.searchSpaces);
  const me = useAppSelector((state) => state.me);
  const memberships = useAppSelector(
    (state) => state.userOrganizationMemberships
  );
  const allOrganizations = useAppSelector((state) => state.organizations);
  const organizations = usersOrganizations(me, memberships, allOrganizations);
  const [sortBy, setSortBy] = useState<SearchSortBy>(results.sortBy);
  const [query, setQuery] = useState(results.query);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedFilter = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const loadMoreTarget = useRef<HTMLDivElement>(null);
  const resultsRef = useRef(results);
  resultsRef.current = results;
  const scrollPosition = useRef(results.scrollY);
  const [restoringScroll, setRestoringScroll] = useState(
    results.hits.length > 0 && results.scrollY > 0
  );
  const signedIn = me.tag === "SIGNED_IN";
  const busy =
    results.status === "idle" ||
    results.status === "loading" ||
    results.query !== query.trim() ||
    results.sortBy !== sortBy;
  const more = results.page < results.nbPages - 1;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 651px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setFiltersOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const cached = resultsRef.current;
    // Returning from a model keeps all loaded pages instead of fetching page 1.
    if (
      cached.status !== "idle" &&
      cached.query === query.trim() &&
      cached.sortBy === sortBy
    )
      return;
    const timer = setTimeout(() => {
      scrollPosition.current = 0;
      window.scrollTo(0, 0);
      dispatch(search.fetch(query.trim(), { sortBy }));
    }, 250);
    return () => clearTimeout(timer);
  }, [query, sortBy, dispatch]);
  useEffect(() => {
    let leaving = false;
    let restoring =
      resultsRef.current.hits.length > 0 && scrollPosition.current > 0;
    const trackScroll = () => {
      if (!leaving && !restoring) scrollPosition.current = window.scrollY;
    };
    const saveScroll = () => {
      // Next.js resets scroll during navigation, so save before that happens.
      leaving = true;
      dispatch({
        type: "SEARCH_SPACES_SAVE_SCROLL",
        scrollY: scrollPosition.current,
      });
    };
    const cancelNavigation = () => {
      leaving = false;
    };
    let secondFrame = 0;
    const frame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (restoring && !leaving) window.scrollTo(0, scrollPosition.current);
        restoring = false;
        setRestoringScroll(false);
      });
    });
    window.addEventListener("scroll", trackScroll, { passive: true });
    router.events.on("routeChangeStart", saveScroll);
    router.events.on("routeChangeError", cancelNavigation);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(secondFrame);
      window.removeEventListener("scroll", trackScroll);
      router.events.off("routeChangeStart", saveScroll);
      router.events.off("routeChangeError", cancelNavigation);
    };
  }, [dispatch, router.events]);
  useEffect(() => {
    const target = loadMoreTarget.current;
    if (
      !target ||
      busy ||
      !more ||
      restoringScroll ||
      results.status !== "ready" ||
      results.error
    )
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting))
          dispatch(search.fetchNextPage());
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [
    busy,
    more,
    restoringScroll,
    results.status,
    results.error,
    results.page,
    dispatch,
  ]);
  useEffect(() => {
    const alreadyHidden = document.body.classList.contains("remove-elev");
    document.body.classList.add("remove-elev");
    return () => {
      if (!alreadyHidden) document.body.classList.remove("remove-elev");
    };
  }, []);
  const retry = () => dispatch(search.fetch(query.trim(), { sortBy }));

  return (
    <div className={styles.page}>
      <Head>
        <title key="title">Browse models — Guesstimate</title>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <ErrorModal />
      <ModalContainer />
      <PageHeader className={styles.header} brandClassName={styles.brand} />
      <main className={styles.main}>
        <div className={styles.pageHeading}>
          <div>
            <h1>Browse models</h1>
            <p>Public models shared by the community.</p>
          </div>
        </div>
        {signedIn && organizations.length > 0 && (
          <nav
            className={styles.organizationLinks}
            aria-label="Your organizations"
          >
            <span>Organizations</span>
            {organizations.map((organization) => (
              <a
                key={organization.id}
                href={`/organizations/${organization.id}`}
              >
                {organization.name}
              </a>
            ))}
          </nav>
        )}
        <form
          className={styles.searchRow}
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            retry();
          }}
        >
          <div className={styles.searchField}>
            <label htmlFor="model-search">
              Search<span className={styles.srOnly}> public models</span>
            </label>
            <div className={styles.searchInput}>
              <Icon name="search" />
              <input
                id="model-search"
                ref={input}
                type="search"
                placeholder="Search models"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    input.current?.focus();
                  }}
                >
                  <Icon name="close" />
                </button>
              )}
            </div>
          </div>
          <label className={styles.filter}>
            <span>Filter</span>
            <select
              aria-label="Filter models"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as SearchSortBy)
              }
            >
              <option value="RECOMMENDED">Recommended</option>
              <option value="RECENT">Recent</option>
            </select>
          </label>
          <button
            type="button"
            className={styles.filterTrigger}
            aria-label={`Filter models: ${
              sortBy === "RECENT" ? "Recent" : "Recommended"
            }`}
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen(true)}
          >
            <Icon name="filter" />
            {sortBy === "RECENT" && (
              <span className={styles.filterDot} aria-hidden="true" />
            )}
          </button>
        </form>
        <Modal
          isOpen={filtersOpen}
          onRequestClose={() => setFiltersOpen(false)}
          onAfterOpen={() => selectedFilter.current?.focus()}
          appElement={
            typeof document !== "undefined"
              ? document.getElementById("__next") || undefined
              : undefined
          }
          contentLabel="Filter models"
          className={styles.filterSheet}
          overlayClassName={styles.filterOverlay}
          bodyOpenClassName={styles.filterOpen}
        >
          <div className={styles.filterSheetHeading}>
            <h2>Filter models</h2>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
            >
              <Icon name="close" />
            </button>
          </div>
          <div
            role="group"
            aria-label="Models to show"
            className={styles.filterOptions}
          >
            {(["RECOMMENDED", "RECENT"] as const).map((value) => (
              <button
                type="button"
                key={value}
                ref={sortBy === value ? selectedFilter : undefined}
                aria-pressed={sortBy === value}
                onClick={() => {
                  setSortBy(value);
                  setFiltersOpen(false);
                }}
              >
                <span>
                  {value === "RECOMMENDED" ? "Recommended" : "Recent"}
                </span>
                {sortBy === value && <Icon name="check" />}
              </button>
            ))}
          </div>
        </Modal>
        <div className={styles.resultsHeading} role="status" aria-live="polite">
          {busy
            ? "Loading models…"
            : results.error === "search"
            ? "Search unavailable"
            : `${results.nbHits.toLocaleString("en")} ${
                results.nbHits === 1 ? "model" : "models"
              }${query.trim() ? ` matching “${query.trim()}”` : ""}`}
        </div>
        <section aria-label="Public models" aria-busy={busy}>
          {busy ? (
            <div className={styles.grid} aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={styles.skeleton}>
                  <div />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          ) : results.error === "search" ? (
            <div className={styles.emptyState} role="alert">
              <Icon name="search" />
              <h2>Models couldn’t be loaded</h2>
              <p>Please try again.</p>
              <button className={styles.action} type="button" onClick={retry}>
                Retry
              </button>
            </div>
          ) : results.hits.length === 0 ? (
            <div className={styles.emptyState}>
              <Icon name="search" />
              <h2>No models found</h2>
              <p>
                {query.trim()
                  ? "Try another search or change the filter."
                  : "There are no models in this view yet."}
              </p>
              <button
                className={styles.action}
                type="button"
                onClick={() => {
                  setQuery("");
                  setSortBy("RECENT");
                }}
              >
                Show recent models
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {results.hits.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          )}
        </section>
        {!busy && results.hits.length > 0 && (
          <div className={styles.pagination} ref={loadMoreTarget}>
            {results.error === "more" && (
              <p role="alert">
                Couldn’t load more models. Your current results are still here.
              </p>
            )}
            {more && results.error === "more" && (
              <button
                type="button"
                className={styles.action}
                onClick={() => dispatch(search.fetchNextPage())}
                disabled={results.status === "loadingMore"}
              >
                Retry loading more
              </button>
            )}
            <div className={styles.loadStatus} role="status" aria-live="polite">
              {results.status === "loadingMore" ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Loading more models…
                </>
              ) : more ? (
                <>
                  Showing {results.hits.length.toLocaleString("en")} of{" "}
                  {results.nbHits.toLocaleString("en")}
                </>
              ) : (
                <>
                  All {results.hits.length.toLocaleString("en")} models loaded
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <footer className={styles.footer}>
        <span>Guesstimate</span>
        <nav aria-label="Information">
          <a href="/pricing">Plans</a>
          <a href="https://docs.getguesstimate.com/docs/Introduction">
            Documentation
          </a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  );
}
