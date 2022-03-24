export const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : (() => {
      const x = new URL(window.location.href)
      x.pathname = '/'
      return x
    })()
