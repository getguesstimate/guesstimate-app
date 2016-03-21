import {API_KEY, PURCHASE_SUCCESS_ACTION, ADDED_PRODUCT_ACTION, VIEWED_PRODUCT_ACTION, ACCOUNT_MODAL_CLICK, USER_MENU_OPEN, USER_MENU_CLOSE} from './constants.js'

export function initialize() {
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load(API_KEY);
  }}()
}

const LITE_PLAN = "lite"
const PREMIUM_PLAN = "premium"

function trackAddedProduct(planType) {
  window.analytics.track(ADDED_PRODUCT_ACTION, {
    id: planType,
    name: planType
  })
}

function trackViewedAllProducts() {
  window.analytics.track(VIEWED_PRODUCT_ACTION, {
    id: LITE_PLAN,
    name: LITE_PLAN
  })
  window.analytics.track(VIEWED_PRODUCT_ACTION, {
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

export function trackPurchaseSuccess(planType) {
  window.analytics.track(PURCHASE_SUCCESS_ACTION, {products: [{id: planType}]})
}

export function trackAccountModalClick() {
  window.analytics.track(ACCOUNT_MODAL_CLICK)
}

export function trackUserMenuOpen() {
  window.analytics.track(USER_MENU_OPEN)
}

export function trackUserMenuClose() {
  window.analytics.track(USER_MENU_CLOSE)
}
