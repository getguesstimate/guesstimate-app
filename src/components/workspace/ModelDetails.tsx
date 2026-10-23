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
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privateModel, setPrivateModel] = useState(false);
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
  return (
    <Modal
      isOpen={open}
      onRequestClose={() => {
        if (!busy) onClose();
      }}
      appElement={
        typeof document !== "undefined"
          ? document.getElementById("__next") || undefined
          : undefined
      }
      aria={{ labelledby: "model-details-title" }}
      className={`${styles.noteDialog} ${styles.modelDialog}`}
      overlayClassName={styles.noteOverlay}
      shouldCloseOnOverlayClick={false}
    >
      <div className={styles.noteDialogHeading}>
        <h2 id="model-details-title" ref={headingRef} tabIndex={-1}>
          Model details
        </h2>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Close model details"
          disabled={busy}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      <div className={styles.modelDialogBody}>
        {tool.type !== "CLOSED" ? (
          <>
            <button
              type="button"
              className={styles.noteAction}
              onClick={() => toolDispatch({ type: "CLOSE" })}
            >
              ← Model details
            </button>
            <div className={styles.modelTool}>
              <RightSidebar
                space={space}
                organizationFacts={organizationFacts}
                state={tool}
                rightSidebarDispatch={toolDispatch}
              />
            </div>
          </>
        ) : (
          <>
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
                      value={privateModel ? "private" : "public"}
                      disabled={busy}
                      onChange={(event) =>
                        setPrivateModel(event.target.value === "private")
                      }
                    >
                      <option value="public">Public</option>
                      <option value="private" disabled={!canBePrivate}>
                        Private
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
                    {!canBePrivate && (
                      <p>Your plan doesn’t support another private model.</p>
                    )}
                  </FieldHelp>
                </div>
                <div className={styles.modelActions}>
                  <button
                    type="button"
                    className={styles.noteAction}
                    disabled={busy}
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
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
                <div className={styles.modelSectionHeading}>
                  <h3>{space.name || "Untitled model"}</h3>
                  {space.editableByMe && (
                    <button
                      type="button"
                      className={styles.noteAction}
                      onClick={beginEdit}
                    >
                      Edit details
                    </button>
                  )}
                </div>
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
                {(space.calculators?.length > 0 ||
                  space.editableByMe ||
                  engine.space.canUseOrganizationFacts(space)) && (
                  <section className={styles.modelSection}>
                    <h3>Tools</h3>
                    <div className={styles.modelActions}>
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
                      {space.editableByMe && (
                        <button
                          type="button"
                          className={styles.noteAction}
                          onClick={() =>
                            toolDispatch({ type: "MAKE_NEW_CALCULATOR" })
                          }
                        >
                          New calculator
                        </button>
                      )}
                      {engine.space.canUseOrganizationFacts(space) && (
                        <button
                          type="button"
                          className={styles.noteAction}
                          onClick={() => toolDispatch({ type: "TOGGLE_FACTS" })}
                        >
                          Metric Library
                        </button>
                      )}
                    </div>
                  </section>
                )}
                <section className={styles.modelSection}>
                  <div className={styles.modelActions}>
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
                        Delete “{space.name || "Untitled model"}”? This can’t be
                        undone.
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
                              setError("Couldn’t delete the model. Try again.");
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
                </section>
              </>
            )}
          </>
        )}
        {error && (
          <p role="alert" className={styles.nodeError}>
            {error}
          </p>
        )}
        {space.canvasState.actionState === "ERROR_COPYING" && (
          <p role="alert" className={styles.nodeError}>
            Couldn’t copy the model. Try again.
          </p>
        )}
        {message && <p role="status">{message}</p>}
      </div>
    </Modal>
  );
}
