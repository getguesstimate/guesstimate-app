const emptyState = {
  componentName: false,
  props: {},
};

export default function modal(state = emptyState, action) {
  switch (action.type) {
    case "MODAL_CHANGE":
      const { componentName, props } = action;
      return { componentName, props };
    case "MODAL_CLOSE":
      return emptyState;
    default:
      return state;
  }
}
