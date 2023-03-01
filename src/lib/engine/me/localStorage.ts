const globalKey = "Guesstimate-Test";
const reducer = "me";
const varName = globalKey + reducer;

export function get() {
  try {
    // TODO - validate with yup
    return JSON.parse(localStorage.getItem(varName) || "-");
  } catch (e) {
    set(null);
    return null;
  }
}

export function set(item: { token: string; auth0_id: string } | null) {
  localStorage.setItem(varName, JSON.stringify(item));
}

export function clear() {
  return localStorage.removeItem(varName);
}
