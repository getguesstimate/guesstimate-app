import { useSyncExternalStore } from "react";
import themes from "./themes.json";

export type ThemePreference = "system" | keyof typeof themes;
export const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  ...Object.entries(themes).map(([value, theme]) => ({
    value: value as keyof typeof themes,
    label: theme.label,
  })),
];

declare global {
  interface Window {
    guesstimateTheme?: { setPreference(value: ThemePreference): boolean };
  }
}
const subscribe = (notify: () => void) => {
  window.addEventListener("guesstimate:theme-change", notify);
  return () => window.removeEventListener("guesstimate:theme-change", notify);
};
const snapshot = () =>
  (document.documentElement.dataset.themePreference ||
    "system") as ThemePreference;
export function useTheme() {
  return useSyncExternalStore(
    subscribe,
    snapshot,
    () => "system" as ThemePreference
  );
}
export function setTheme(value: ThemePreference) {
  return window.guesstimateTheme?.setPreference(value) ?? false;
}
