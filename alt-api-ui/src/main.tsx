import { Settings } from 'luxon'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { registerSW } from 'virtual:pwa-register'

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
