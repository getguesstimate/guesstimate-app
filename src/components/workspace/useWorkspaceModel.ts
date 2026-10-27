import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "~/modules/hooks";
import { loadScratchpad } from "~/modules/scratchpad/actions";
import { SCRATCHPAD_ID } from "~/modules/scratchpad/model";
import {
  clearEditsAllowed,
  changeMetricClickMode,
} from "~/modules/canvas_state/actions";
import { loadWorkspaceModel } from "./modelActions";

export function useWorkspaceModel(
  spaceId: number,
  shareableLinkToken: string | null
) {
  const dispatch = useAppDispatch();
  const isScratchpad = spaceId === SCRATCHPAD_ID;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.resolve(
      dispatch(
        isScratchpad
          ? loadScratchpad()
          : loadWorkspaceModel(spaceId, shareableLinkToken)
      )
    )
      .then(() => setLoading(false))
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [dispatch, isScratchpad, spaceId, shareableLinkToken]);
  useEffect(() => {
    dispatch(clearEditsAllowed());
  }, [dispatch, spaceId]);
  useEffect(load, [load]);
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const wasHidden = document.body.classList.contains("remove-elev");
    document.body.classList.add("remove-elev");
    return () => {
      document.body.style.overflow = oldOverflow;
      if (!wasHidden) document.body.classList.remove("remove-elev");
      dispatch(changeMetricClickMode("DEFAULT"));
    };
  }, [dispatch]);

  return { loading, error, load };
}
