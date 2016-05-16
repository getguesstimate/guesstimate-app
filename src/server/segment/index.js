import * as Constants from './constants.js'

const LITE_PLAN = "lite"
const PREMIUM_PLAN = "premium"
const EMPLOYEE_USER_IDS = [240 /* Matthew Gmail */, 1 /* Ozzie Github */, 4227 /* Matthew Github */]

export function initialize() {
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load(Constants.API_KEY);
  }}()
}

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

export function trackUsedViewMode(mode) {
  window.analytics.track(Constants.USED_VIEW_MODE, {mode})
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
  if (_.some(EMPLOYEE_USER_IDS, e => e == userId)) {
    console.warn("Skipping data analytics via user ID.")
  } else {
    window.analytics.identify(userId, info)
  }
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
