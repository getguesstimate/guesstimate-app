import {API_KEY, PURCHASE_SUCCESS_ACTION, ACCOUNT_MODAL_CLICK, USER_MENU_OPEN, USER_MENU_CLOSE} from './constants.js'

export function initialize() {
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="3.1.0";
    analytics.load(API_KEY);
  }}()
}

export function pageLoad() {
  window.analytics.page()
}

export function trackUser(userId, info) {
  window.analytics.identify(userId, info)
}

export function trackPurchaseSuccess(account, planType) {
  const orderId = `${account.id}-${Date.now()}` // The unique order for this account finishing right now.
  window.analytics.track(PURCHASE_SUCCESS_ACTION, {orderId: orderId, products: [{id: planType}]})
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
