import $ from "jquery";

export const GUESSTIMATE_TYPES = 34126;
export const EXISTING_FUNCTIONS = 34121;
export const CONFIDENCE_INTERVALS = 34205;
export const ADDITIONAL_DISTRIBUTIONS = 50927;
export const SIPS_AND_SLURPS = 67122;

export function open(id) {
  window._elev.openArticle(id);
}

export function hide() {
  $("body").addClass("remove-elev");
}

export function show() {
  $("body").removeClass("remove-elev");
  setTimeout(() => {
    $("#elevio-base-menu li.articles").click((e) => {
      openedElev();
    });
  }, 3000);
}
