import * as Constants from './constants.js'

export function initialize() {
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load(Constants.API_KEY);
  }}()
}

const LITE_PLAN = "lite"
const PREMIUM_PLAN = "premium"

// This function resolves any changes we make in the representation of plans into the unified language used across
// Segment's commerce events.
function segmentPlanType(rawPlanType) {
  switch (rawPlanType) {
    case "lite":
      return LITE_PLAN
    case "premium":
      return PREMIUM_PLAN
  }
}

function trackCanvasInteraction(interaction, options) {
  window.analytics.track(Constants.INTERACTED_WITH_CANVAS, {
    interaction,
    ...options
  })
}

function trackAddedProduct(planType) {
  window.analytics.track(Constants.ADDED_PRODUCT_ACTION, {
    id: planType,
    name: planType
  })
}

function trackViewedAllProducts() {
  window.analytics.track(Constants.VIEWED_PRODUCT_ACTION, {
    id: LITE_PLAN,
    name: LITE_PLAN
  })
  window.analytics.track(Constants.VIEWED_PRODUCT_ACTION, {
    id: PREMIUM_PLAN,
    name: PREMIUM_PLAN
  })
}

const pageEvents = {
  "/subscribe/lite": () => {trackAddedProduct(LITE_PLAN)},
  "/subscribe/premium": () => {trackAddedProduct(PREMIUM_PLAN)},
  "/pricing": trackViewedAllProducts
}

export function pageLoad() {
  if (pageEvents.hasOwnProperty(window.location.pathname)) {
    pageEvents[window.location.pathname]()
  }

  window.analytics.page()
}

export function trackUser(userId, info) {
  window.analytics.identify(userId, info)
}

export function trackToggledViewMode(mode) {
  window.analytics.track(Constants.USED_VIEW_MODE, {mode})
}

export function trackPurchaseSuccess(account, rawPlanType) {
  const planType = segmentPlanType(rawPlanType)
  const orderId = `${account.id}-${Date.now()}` // The unique order for this account finishing right now.
  window.analytics.track(Constants.PURCHASE_SUCCESS_ACTION, {
    orderId: orderId,
    products: [
      {
        id: planType,
        name: planType
      }
    ]
  })
}

export function trackAccountModalClick() {
  window.analytics.track(Constants.ACCOUNT_MODAL_CLICK)
}

export function trackUserMenuOpen() {
  window.analytics.track(Constants.USER_MENU_OPEN)
}

export function trackUserMenuClose() {
  window.analytics.track(Constants.USER_MENU_CLOSE)
}

export function trackCopyModel() {
  window.analytics.track(Constants.COPIED_MODEL)
}

export function trackUndo(via_keyboard) {
  trackCanvasInteraction('undo', {via_keyboard})
}

export function trackRedo(via_keyboard) {
  trackCanvasInteraction('redo', {via_keyboard})
}

export function trackCutMetric(via_keyboard) {
  trackCanvasInteraction('cut metric', {via_keyboard})
}

export function trackCopyMetric(via_keyboard) {
  trackCanvasInteraction('copy metric', {via_keyboard})
}

export function trackPasteMetric(via_keyboard) {
  trackCanvasInteraction('paste metric', {via_keyboard})
}

export function trackSelectedRegion() {
  trackCanvasInteraction('select region')
}

export function trackOpenSidebar() {
  trackCanvasInteraction('open sidebar')
}

export function trackCloseSidebar() {
  trackCanvasInteraction('close sidebar')
}

export function trackSwitchToViewMode() {
  trackCanvasInteraction('switch to view mode')
}

export function trackSwitchToEditMode() {
  trackCanvasInteraction('switch to edit mode')
}
