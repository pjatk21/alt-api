import { Settings } from 'luxon'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// wtf, is this a valid solution??
// window.React = React

// set locale
Settings.defaultLocale = navigator.language

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
