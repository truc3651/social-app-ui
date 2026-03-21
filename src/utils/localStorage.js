export const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/`
}


export const setCookie = (name, value, options = {}) => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (options.maxAge) cookie += `; max-age=${options.maxAge}`
  if (options.expires) cookie += `; expires=${options.expires.toUTCString()}`
  if (options.path) cookie += `; path=${options.path}`
  if (options.domain) cookie += `; domain=${options.domain}`
  if (options.secure) cookie += `; secure`
  if (options.sameSite) cookie += `; samesite=${options.sameSite}`

  document.cookie = cookie
}