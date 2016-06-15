// API Access Constants
const DEV_API_KEY = 'XIOVIJJihFrKFeGH6KwxT3ve2Y1Bxnta'
const PRODUCTION_API_KEY = 'HXZO1nlg9qD4tfCcSSqdcjxq3pGaF0eU'
export const API_KEY = (__SEGMENT_API_ENV__ === 'development') ? DEV_API_KEY : PRODUCTION_API_KEY

// Event Tracking Constants
export const PURCHASE_SUCCESS_ACTION = "Completed Order"
export const ADDED_PRODUCT_ACTION = "Added Product"
export const VIEWED_PRODUCT_ACTION = "Viewed Product"
export const ACCOUNT_MODAL_CLICK = "Clicked account modal"
export const USER_MENU_OPEN = "Opened user menu"
export const USER_MENU_CLOSE = "Closed user menu"

export const USED_VIEW_MODE = "Used view mode"

export const INTERACTED_WITH_CANVAS = "Interacted with canvas"
