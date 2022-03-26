import { Settings } from 'luxon'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { registerSW } from 'virtual:pwa-register'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import './global.sass'

// setup sentry
if (import.meta.env.PROD)
  Sentry.init({
    dsn: 'https://cefc1ce1d2fd4a5ab29407a1392673b5@o1084354.ingest.sentry.io/6290616',
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
    environment: 'PRODUCTION',
  })

// set locale
Settings.defaultLocale = navigator.language

// register service worker
registerSW()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
