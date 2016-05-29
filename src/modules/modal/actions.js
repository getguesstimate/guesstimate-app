export function openSettings(props) {
  return { type: 'MODAL_CHANGE', componentName: 'settings', props };
}

export function openFirstSubscription(planId) {
  return { type: 'MODAL_CHANGE', componentName: 'firstSubscription', props: {planId} };
}

export function openConfirmation(props) {
  return { type: 'MODAL_CHANGE', componentName: 'confirmation', props };
}

export function change({componentName, props}) {
  return { type: 'MODAL_CHANGE', componentName, props };
}

export function close() {
  return { type: 'MODAL_CLOSE' };
}
