export const baseUrl = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.host}/`.replace('3000', '4000')
  : `${window.location.protocol}//${window.location.host}/`
