import { Location } from "~/lib/locationUtils";

export function changeSelect(
  location: Location,
  selectedFrom?: "UP" | "DOWN" | "LEFT" | "RIGHT" | null
) {
  return { type: "CHANGE_SELECT", selection: { ...location, selectedFrom } };
}

export function deSelect() {
  return { type: "DE_SELECT" };
}
