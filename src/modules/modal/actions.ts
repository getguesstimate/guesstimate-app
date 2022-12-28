export function openSettings() {
  return { type: "MODAL_CHANGE", componentName: "settings", props: {} };
}

export function openFirstSubscription(planId) {
  return {
    type: "MODAL_CHANGE",
    componentName: "firstSubscription",
    props: { planId },
  };
}

export function openConfirmation(props) {
  return { type: "MODAL_CHANGE", componentName: "confirmation", props };
}

export function close() {
  return { type: "MODAL_CLOSE" };
}
