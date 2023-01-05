import { CanvasLocation } from "~/lib/locationUtils";

export function changeSelect(
  location: CanvasLocation,
  selectedFrom?: "UP" | "DOWN" | "LEFT" | "RIGHT" | null
) {
  return { type: "CHANGE_SELECT", selection: { ...location, selectedFrom } };
}

export function deSelect() {
  return { type: "DE_SELECT" };
}
