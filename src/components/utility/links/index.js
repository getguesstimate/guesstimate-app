import React, {Component} from 'react'
import IubendaPrivacyPolicy from 'gComponents/lib/iubenda_privacy_policy.js'

export const LinkFAQ = () => (
  <a href='/faq'> FAQ </a>
)

export const LinkBlog = () => (
  <a href='https://medium.com/guesstimate-blog'> Blog </a>
)

export const LinkTerms = () => (
  <a href='/terms'> Terms of Service </a>
)

export const LinkPrivacy = () => (
  <IubendaPrivacyPolicy id={7790420}>
    Privacy Policy
  </IubendaPrivacyPolicy>
)
