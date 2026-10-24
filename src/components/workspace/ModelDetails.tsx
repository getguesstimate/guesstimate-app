import { useEffect, useReducer, useRef, useState } from "react";
import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import * as engine from "~/lib/engine/engine";
import { parseSlurp } from "~/lib/slurpParser";
import {
  ExtendedDSpace,
  denormalizedSpaceSelector,
} from "~/components/spaces/denormalized-space-selector";
import {
  RightSidebar,
  rightSidebarReducer,
  RightSidebarState,
} from "~/components/spaces/SpaceShow/RightSidebar";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import * as actions from "~/modules/spaces/actions";
import * as calculatorActions from "~/modules/calculators/actions";
import { CalculatorActions } from "~/components/calculators/CalculatorActions";
import calculatorStyles from "../calculators/calculator.module.css";
import { runSimulations } from "~/modules/simulations/actions";
import { FieldHelp } from "./FieldHelp";
import { Icon } from "./Icon";
import styles from "./workspace.module.css";

export function ModelDetails({
  space,
  open,
  onClose,
  initialCalculatorId,
  factsShown,
  showCalculatorResults,
}: {
  space: ExtendedDSpace;
  open: boolean;
  onClose(): void;
  initialCalculatorId?: number;
  factsShown?: boolean;
  showCalculatorResults?: boolean;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const me = useAppSelector((state) => state.me);
  const { organizationFacts } = useAppSelector((state) =>
    denormalizedSpaceSelector(state, { spaceId: space.id })
  );
  const [section, setSection] = useState("details");
  const [deleteCalculator, setDeleteCalculator] = useState(false);
  const cancelCalculatorDelete = useRef<HTMLButtonElement>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privateModel, setPrivateModel] = useState(false);
  const [privacyNotice, setPrivacyNotice] = useState(false);
  const visibilityRef = useRef<HTMLSelectElement>(null);
  const privacyCancelRef = useRef<HTMLButtonElement>(null);
  const dismissPrivacyNotice = () => {
    setPrivacyNotice(false);
    requestAnimationFrame(() => visibilityRef.current?.focus());
  };
  useEffect(() => {
    if (privacyNotice) privacyCancelRef.current?.focus();
  }, [privacyNotice]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [importing, setImporting] = useState(false);
  const [slurp, setSlurp] = useState("");
  const [tool, toolDispatch] = useReducer(rightSidebarReducer, {
    type: "CLOSED",
  } as RightSidebarState);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusHeading = () =>
    requestAnimationFrame(() => headingRef.current?.focus());
  const initialTool = useRef<RightSidebarState | null>(
    initialCalculatorId
      ? {
          type: "SHOW_CALCULATOR",
          showCalculatorId: initialCalculatorId,
          showCalculatorResults,
        }
      : factsShown && engine.space.canUseOrganizationFacts(space)
      ? { type: "FACT_SIDEBAR" }
      : { type: "CLOSED" }
  );
  useEffect(() => {
    if (!open) return;
    setEditing(false);
    setPrivacyNotice(false);
    setSection("details");
    setDeleteCalculator(false);
    setConfirmDelete(false);
    setImporting(false);
    setError("");
    setMessage("");
    toolDispatch({
      type: "OPEN",
      payload: initialTool.current || { type: "CLOSED" },
    });
    initialTool.current = null;
  }, [open]);
  const selectedCalculator =
    tool.type === "SHOW_CALCULATOR"
      ? space.calculators?.find((c) => c.id === tool.showCalculatorId)
      : undefined;
  const dialogTitle =
    tool.type === "NEW_CALCULATOR_FORM"
      ? "New calculator"
      : tool.type === "EDIT_CALCULATOR_FORM"
      ? "Edit calculator"
      : tool.type === "SHOW_CALCULATOR"
      ? selectedCalculator?.title || "Calculator"
      : tool.type === "FACT_SIDEBAR"
      ? "Metric library"
      : editing
      ? "Edit model details"
      : "Model details";
  useEffect(() => {
    if (open) {
      focusHeading();
      setDeleteCalculator(false);
      setError("");
      setMessage("");
    }
  }, [tool.type, section, open]);
  useEffect(() => {
    if (deleteCalculator) cancelCalculatorDelete.current?.focus();
  }, [deleteCalculator]);
  const owner = engine.space.getOwner(space);
  const ownerUrl = space.organization?.name
    ? `/organizations/${space.organization.id}`
    : space.user?.id
    ? `/users/${space.user.id}`
    : undefined;
  const canBePrivate =
    space.is_private ||
    (space.organization?.name
      ? engine.organization.canMakeMorePrivateModels(space.organization)
      : engine.me.canMakeMorePrivateModels(me));
  const privacyOwner = space.organization?.name
    ? space.organization
    : me.profile;
  const privateModelLimit = privacyOwner?.plan?.private_model_limit;
  const privateModelCount = privacyOwner?.private_model_count;
  const hasPrivateUsage =
    typeof privateModelLimit === "number" &&
    privateModelLimit > 0 &&
    typeof privateModelCount === "number";
  const privateLimitReached =
    !canBePrivate && hasPrivateUsage && privateModelCount >= privateModelLimit;
  const link = engine.space.urlWithToken(space);
  const beginEdit = () => {
    setName(space.name || "");
    setDescription(space.description || "");
    setPrivateModel(!!space.is_private);
    setEditing(true);
    setMessage("");
    setError("");
  };
  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const saved = await dispatch(async (dispatch, getState) => {
        await dispatch(
          actions.generalUpdate(space.id, {
            name,
            description,
            is_private: privateModel,
          })
        );
        return getState().canvasState.actionState === "SAVED";
      });
      if (saved) {
        setEditing(false);
        setMessage("Details saved.");
        focusHeading();
      } else
        setError(
          "Couldn’t save model details. Your draft is still here; try again."
        );
    } catch {
      setError("Couldn’t save model details. Try again.");
    } finally {
      setBusy(false);
    }
  };
  const shareAction = async (action: "enable" | "disable" | "reset") => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await dispatch(
        action === "enable"
          ? actions.enableShareableLink(space.id)
          : action === "disable"
          ? actions.disableShareableLink(space.id)
          : actions.rotateShareableLink(space.id)
      );
      setMessage(
        action === "disable"
          ? "Link disabled."
          : action === "reset"
          ? "Link reset."
          : "Link enabled."
      );
    } catch {
      setError("Couldn’t update the shareable link. Try again.");
    } finally {
      setBusy(false);
      focusHeading();
    }
  };
  const importSlurp = () => {
    setError("");
    try {
      const parsed = parseSlurp(JSON.parse(slurp), space);
      if (!parsed.newMetrics?.length) throw new Error("No nodes");
      dispatch({
        type: "ADD_METRICS",
        items: parsed.newMetrics,
        newGuesstimates: parsed.newGuesstimates,
      });
      dispatch(actions.registerGraphChange(space.id));
      dispatch(
        runSimulations({
          spaceId: space.id,
          simulateSubset: parsed.newMetrics.map((m) => m.id),
        })
      );
      setImporting(false);
      setSlurp("");
      setMessage("Nodes imported.");
    } catch {
      setError("Couldn’t import this Slurp. Check the JSON and try again.");
    }
  };
  const closeCurrentView = () => {
    if (busy) return;
    if (privacyNotice) {
      dismissPrivacyNotice();
      return;
    }
    if (editing) {
      setEditing(false);
      setError("");
      setMessage("");
      focusHeading();
      return;
    }
    if (tool.type === "EDIT_CALCULATOR_FORM") {
      const calculator = space.calculators.find(
        (c) => c.id === tool.editCalculatorId
      );
      if (calculator) {
        toolDispatch({ type: "SHOW_CALCULATOR", payload: calculator });
        return;
      }
    }
    onClose();
  };
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeCurrentView}
      appElement={
        typeof document !== "undefined"
          ? document.getElementById("__next") || undefined
          : undefined
      }
      onAfterOpen={focusHeading}
      bodyOpenClassName={styles.modelModalOpen}
      aria={{
        labelledby: "model-details-title",
        describedby: privacyNotice ? "private-model-explanation" : undefined,
      }}
      className={`${styles.noteDialog} ${styles.modelDialog} ${
        privacyNotice ? styles.privacyNotice : ""
      }`}
      overlayClassName={styles.noteOverlay}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.noteDialogHeading}>
        {tool.type !== "CLOSED" && (
          <button
            type="button"
            className={styles.iconButton}
            aria-label={
              tool.type === "EDIT_CALCULATOR_FORM"
                ? "Back to calculator"
                : "Back to model details"
            }
            title={
              tool.type === "EDIT_CALCULATOR_FORM"
                ? "Back to calculator"
                : "Back to model details"
            }
            onClick={() => {
              if (tool.type === "EDIT_CALCULATOR_FORM") {
                const calculator = space.calculators.find(
                  (c) => c.id === tool.editCalculatorId
                );
                if (calculator) {
                  toolDispatch({
                    type: "SHOW_CALCULATOR",
                    payload: calculator,
                  });
                  return;
                }
              }
              toolDispatch({ type: "CLOSE" });
            }}
          >
            <span aria-hidden="true">←</span>
          </button>
        )}
        <h2 id="model-details-title" ref={headingRef} tabIndex={-1}>
          {privacyNotice
            ? privateLimitReached
              ? "Private-model limit reached"
              : "Private models"
            : dialogTitle}
        </h2>
        {tool.type === "SHOW_CALCULATOR" && (
          <CalculatorActions
            id={tool.showCalculatorId}
            editable={space.editableByMe}
            onEdit={() =>
              toolDispatch({
                type: "OPEN",
                payload: {
                  type: "EDIT_CALCULATOR_FORM",
                  editCalculatorId: tool.showCalculatorId,
                },
              })
            }
            onDelete={() => {
              setDeleteCalculator(true);
              setError("");
            }}
          />
        )}
        <button
          type="button"
          className={styles.iconButton}
          aria-label={
            privacyNotice
              ? "Close private-model notice"
              : editing
              ? "Cancel editing details"
              : tool.type === "EDIT_CALCULATOR_FORM"
              ? "Cancel editing calculator"
              : tool.type === "CLOSED"
              ? "Close model details"
              : tool.type === "FACT_SIDEBAR"
              ? "Close metric library"
              : "Close calculator dialog"
          }
          disabled={busy}
          onClick={closeCurrentView}
        >
          <Icon name="close" />
        </button>
      </div>
      <div className={styles.modelDialogBody}>
        {privacyNotice ? (
          <div>
            <p
              id="private-model-explanation"
              className={styles.privacyExplanation}
            >
              {privateLimitReached
                ? `You’ve used ${privateModelCount} of ${privateModelLimit} private models.`
                : "Your current plan doesn’t include private models."}
            </p>
            <div className={styles.privacyActions}>
              <button
                ref={privacyCancelRef}
                type="button"
                className={styles.noteAction}
                onClick={dismissPrivacyNotice}
              >
                Cancel
              </button>
              <a className={styles.noteSave} href="/billing">
                View plans
              </a>
            </div>
          </div>
        ) : tool.type !== "CLOSED" ? (
          <>
            {deleteCalculator && tool.type === "SHOW_CALCULATOR" && (
              <div className={calculatorStyles.confirm}>
                <p>
                  Delete this calculator? The model and its nodes will be kept.
                </p>
                <div className={styles.modelActions}>
                  <button
                    ref={cancelCalculatorDelete}
                    type="button"
                    className={styles.noteAction}
                    disabled={busy}
                    onClick={() => {
                      setDeleteCalculator(false);
                      focusHeading();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.modelDelete}
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      setError("");
                      try {
                        await dispatch(
                          calculatorActions.destroy(tool.showCalculatorId)
                        );
                        toolDispatch({ type: "CLOSE" });
                      } catch {
                        setError("Couldn’t delete the calculator. Try again.");
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    {busy ? "Deleting…" : "Delete calculator"}
                  </button>
                </div>
                {error && (
                  <p role="alert" className={styles.nodeError}>
                    {error}
                  </p>
                )}
              </div>
            )}
            <div className={styles.modelTool}>
              <RightSidebar
                embedded
                space={space}
                organizationFacts={organizationFacts}
                state={tool}
                rightSidebarDispatch={toolDispatch}
              />
            </div>
          </>
        ) : (
          <>
            {!editing && (
              <nav className={styles.modelSections} aria-label="Model sections">
                {[
                  ["details", "Details"],
                  [
                    "tools",
                    engine.space.canUseOrganizationFacts(space)
                      ? "Calculators & Metrics"
                      : "Calculators",
                  ],
                  ["more", "More"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    aria-current={section === value ? "page" : undefined}
                    onClick={() => {
                      setSection(value);
                      setConfirmDelete(false);
                      setImporting(false);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            )}
            {editing ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void save();
                }}
              >
                <label className={styles.field}>
                  Title
                  <input
                    autoFocus
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={busy}
                  />
                </label>
                <label className={styles.field}>
                  Description
                  <textarea
                    className={styles.modelDescriptionInput}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={busy}
                  />
                </label>
                <div className={styles.modelInline}>
                  <label className={styles.field}>
                    Visibility
                    <select
                      ref={visibilityRef}
                      value={privateModel ? "private" : "public"}
                      disabled={busy}
                      onChange={(event) => {
                        const wantsPrivate = event.target.value === "private";
                        if (wantsPrivate && !canBePrivate) {
                          if (privateLimitReached) setPrivacyNotice(true);
                          else void router.push("/billing");
                          return;
                        }
                        setPrivateModel(wantsPrivate);
                      }}
                    >
                      <option value="public">Public</option>
                      <option value="private">
                        {!canBePrivate && !privateLimitReached
                          ? "Private — upgrade plan"
                          : "Private"}
                      </option>
                    </select>
                  </label>
                  <FieldHelp label="Help with model visibility">
                    <p>
                      Public models can be viewed by anyone. Private models are
                      available to their owner, organization members, and people
                      with an enabled shareable link. Only people with edit
                      access can save changes.
                    </p>
                    {hasPrivateUsage && (
                      <p>
                        {privateModelCount} of {privateModelLimit} private
                        models used.
                      </p>
                    )}
                    {!canBePrivate && (
                      <p>
                        {privateLimitReached
                          ? "Your private-model limit has been reached."
                          : "Your plan doesn’t support another private model."}{" "}
                        Choosing Private shows your plan options.
                      </p>
                    )}
                  </FieldHelp>
                </div>
                {error && (
                  <p role="alert" className={styles.nodeError}>
                    {error}
                  </p>
                )}
                <div
                  className={`${styles.modelActions} ${styles.modelFormFooter}`}
                >
                  <button
                    type="submit"
                    className={styles.noteSave}
                    disabled={busy}
                  >
                    {busy ? "Saving…" : "Save details"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {section === "details" && (
                  <>
                    <div className={styles.modelSectionHeading}>
                      <h3>{space.name || "Untitled model"}</h3>
                      {space.editableByMe && (
                        <button
                          type="button"
                          className={styles.noteAction}
                          onClick={beginEdit}
                        >
                          <Icon name="edit" />
                          Edit details
                        </button>
                      )}
                    </div>
                    {message === "Details saved." && (
                      <p role="status" className={styles.modelFeedback}>
                        {message}
                      </p>
                    )}
                    <div className={styles.modelMetadata}>
                      {owner?.name && (
                        <span>
                          By{" "}
                          {ownerUrl ? (
                            <a href={ownerUrl}>{owner.name}</a>
                          ) : (
                            owner.name
                          )}
                        </span>
                      )}
                      <span>{space.is_private ? "Private" : "Public"}</span>
                    </div>
                    {space.description ? (
                      <div className={styles.noteMarkdown}>
                        <ReactMarkdown source={space.description} skipHtml />
                      </div>
                    ) : (
                      <p className={styles.fieldHint}>No description.</p>
                    )}
                    {space.is_private && space.editableByMe && (
                      <section className={styles.modelSection}>
                        <div className={styles.fieldHeading}>
                          <h3>Shareable link</h3>
                          <FieldHelp label="Help with shareable links">
                            <p>
                              Anyone with this link can view the model and
                              experiment locally. They can’t save changes to the
                              original. Resetting the link disables the previous
                              link.
                            </p>
                          </FieldHelp>
                        </div>
                        {message && message !== "Details saved." && (
                          <p role="status" className={styles.modelFeedback}>
                            {message}
                          </p>
                        )}
                        {error && (
                          <p role="alert" className={styles.nodeError}>
                            {error}
                          </p>
                        )}
                        {link ? (
                          <>
                            <label className={styles.field}>
                              Link
                              <input
                                readOnly
                                value={link}
                                onFocus={(event) => event.target.select()}
                              />
                            </label>
                            <div className={styles.modelActions}>
                              <button
                                type="button"
                                className={styles.noteAction}
                                disabled={busy}
                                onClick={() => shareAction("reset")}
                              >
                                Reset link
                              </button>
                              <button
                                type="button"
                                className={styles.noteAction}
                                disabled={busy}
                                onClick={() => shareAction("disable")}
                              >
                                Disable link
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={styles.noteAction}
                            disabled={busy}
                            onClick={() => shareAction("enable")}
                          >
                            Enable link
                          </button>
                        )}
                      </section>
                    )}
                  </>
                )}
                {section === "tools" && (
                  <div className={styles.modelToolSections}>
                    <section
                      className={styles.modelSection}
                      aria-labelledby="model-calculators-heading"
                    >
                      <div className={styles.fieldHeading}>
                        <h3 id="model-calculators-heading">Calculators</h3>
                        <FieldHelp label="Help with calculators">
                          <p>
                            A calculator presents selected model inputs and
                            results as a form. The model must contain named
                            values and formulas connected to each other.
                          </p>
                        </FieldHelp>
                      </div>
                      {space.editableByMe && (
                        <button
                          type="button"
                          className={styles.newCalculator}
                          onClick={() =>
                            toolDispatch({ type: "MAKE_NEW_CALCULATOR" })
                          }
                        >
                          <Icon name="plus" />
                          New calculator
                        </button>
                      )}
                      <div className={styles.modelToolList}>
                        {space.calculators?.map((calculator) => (
                          <button
                            type="button"
                            key={calculator.id}
                            className={styles.noteAction}
                            onClick={() =>
                              toolDispatch({
                                type: "SHOW_CALCULATOR",
                                payload: calculator,
                              })
                            }
                          >
                            {calculator.title || "Calculator"}
                          </button>
                        ))}
                      </div>
                      {!space.calculators?.length && !space.editableByMe && (
                        <p className={styles.fieldHint}>
                          No calculators available for this model.
                        </p>
                      )}
                    </section>
                    {engine.space.canUseOrganizationFacts(space) && (
                      <section
                        className={styles.modelSection}
                        aria-labelledby="model-metrics-heading"
                      >
                        <h3 id="model-metrics-heading">Metrics</h3>
                        <div className={styles.modelToolList}>
                          <button
                            type="button"
                            className={styles.noteAction}
                            onClick={() =>
                              toolDispatch({ type: "TOGGLE_FACTS" })
                            }
                          >
                            Metric Library
                          </button>
                        </div>
                      </section>
                    )}
                  </div>
                )}
                {section === "more" && (
                  <section className={styles.modelSection}>
                    <div className={styles.modelToolList}>
                      {!!me.profile && (
                        <button
                          type="button"
                          className={styles.noteAction}
                          disabled={busy}
                          onClick={async () => {
                            setBusy(true);
                            await dispatch(actions.copy(space.id, router));
                            setBusy(false);
                          }}
                        >
                          Copy model
                        </button>
                      )}
                      {space.editableByMe && (
                        <>
                          <button
                            type="button"
                            className={styles.noteAction}
                            onClick={() => {
                              setImporting(!importing);
                              setConfirmDelete(false);
                            }}
                          >
                            Import Slurp
                          </button>
                          <button
                            type="button"
                            className={styles.modelDelete}
                            onClick={() => {
                              setConfirmDelete(true);
                              setImporting(false);
                            }}
                          >
                            Delete model
                          </button>
                        </>
                      )}
                    </div>
                    {importing && (
                      <div className={styles.modelSection}>
                        <label className={styles.field}>
                          Slurp JSON
                          <textarea
                            className={styles.modelDescriptionInput}
                            value={slurp}
                            onChange={(event) => setSlurp(event.target.value)}
                          />
                        </label>
                        <div className={styles.modelActions}>
                          <button
                            type="button"
                            className={styles.noteAction}
                            onClick={() => setImporting(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className={styles.noteSave}
                            disabled={!slurp.trim()}
                            onClick={importSlurp}
                          >
                            Import
                          </button>
                        </div>
                      </div>
                    )}
                    {confirmDelete && (
                      <div className={styles.modelSection}>
                        <p>
                          Delete “{space.name || "Untitled model"}”? This can’t
                          be undone.
                        </p>
                        <div className={styles.modelActions}>
                          <button
                            type="button"
                            className={styles.noteAction}
                            disabled={busy}
                            onClick={() => setConfirmDelete(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className={styles.modelDelete}
                            disabled={busy}
                            onClick={async () => {
                              setBusy(true);
                              setError("");
                              try {
                                await dispatch(actions.destroy(space, router));
                              } catch {
                                setError(
                                  "Couldn’t delete the model. Try again."
                                );
                              } finally {
                                setBusy(false);
                              }
                            }}
                          >
                            Delete permanently
                          </button>
                        </div>
                      </div>
                    )}
                    {message && (
                      <p role="status" className={styles.modelFeedback}>
                        {message}
                      </p>
                    )}
                    {error && (
                      <p role="alert" className={styles.nodeError}>
                        {error}
                      </p>
                    )}
                  </section>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
