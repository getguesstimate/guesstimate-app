// Copy-pasted from squiggle components.
export function isMac() {
  // Browser-only. Defaults to `false` when `window` is not available.

  // TODO - support https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform
  // when it will become available in modern browsers.
  // Note: MacIntel is valid even for ARM macs.
  return (
    typeof window !== "undefined" && window.navigator.platform === "MacIntel"
  );
}
