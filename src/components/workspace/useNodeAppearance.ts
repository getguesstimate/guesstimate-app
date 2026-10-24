import { useSyncExternalStore } from "react";

export const NODE_APPEARANCE_KEY = "guesstimate.workspace.simplifiedNodes";
let initialized = false;
let simplified = false;
let memoryOnly = false;
const listeners = new Set<() => void>();

function read() {
  if (memoryOnly) return;
  try {
    simplified = window.localStorage.getItem(NODE_APPEARANCE_KEY) === "true";
  } catch {
    // Retain the in-memory preference when storage is unavailable.
  }
  initialized = true;
}

function snapshot() {
  if (!initialized && typeof window !== "undefined") read();
  return simplified;
}

function onStorage(event: StorageEvent) {
  if (event.key === NODE_APPEARANCE_KEY || event.key === null) {
    memoryOnly = false;
    read();
    listeners.forEach((listener) => listener());
  }
}

function subscribe(listener: () => void) {
  if (!listeners.size) {
    // Also pick up changes made while no workspace or settings were mounted.
    read();
    window.addEventListener("storage", onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("storage", onStorage);
  };
}

export function setSimplifiedNodes(value: boolean) {
  simplified = value;
  initialized = true;
  let saved = true;
  try {
    window.localStorage.setItem(NODE_APPEARANCE_KEY, String(value));
    memoryOnly = false;
  } catch {
    memoryOnly = true;
    saved = false;
  }
  listeners.forEach((listener) => listener());
  return saved;
}

export function useSimplifiedNodes() {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
