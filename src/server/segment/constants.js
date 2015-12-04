const DEV_API_KEY = 'XIOVIJJihFrKFeGH6KwxT3ve2Y1Bxnta'
const PRODUCTION_API_KEY = 'tFCMysKzusXbVgq593tbROJQYEt57Eei'
export const API_KEY = (__API_ENV__ === 'development') ? DEV_API_KEY : PRODUCTION_API_KEY
