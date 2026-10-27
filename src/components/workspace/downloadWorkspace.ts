import type { ExtendedDSpace } from "~/components/spaces/denormalized-space-selector";
import type { FullDenormalizedMetric } from "~/lib/engine/space";

export function downloadWorkspace(
  space: ExtendedDSpace,
  metrics: FullDenormalizedMetric[],
  isScratchpad: boolean
) {
  const graph = {
    name: isScratchpad ? "Scratchpad" : space.name,
    description: space.description,
    metrics: metrics.map(
      ({
        id,
        name,
        readableId,
        location,
        canvasPosition,
        showNotesOnNode,
        titleAlignment,
      }) => ({
        id,
        name,
        readableId,
        location,
        canvasPosition,
        showNotesOnNode,
        titleAlignment,
      })
    ),
    guesstimates: metrics.map((m) => m.guesstimate),
  };
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(graph, null, 2)], { type: "application/json" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = isScratchpad ? "scratchpad.json" : `model-${space.id}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
