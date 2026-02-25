const normalize = (p: string) => {
  if (!p) return '/'
  const trimmed = p.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export function matchRoute(pattern: string, pathname: string) {
  const p = normalize(pattern)
  const path = normalize(pathname)

  const parts = p.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)

  if (parts.length !== pathParts.length) return false

  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i]
    const actual = pathParts[i]

    if (seg.startsWith(':')) continue

    if (seg !== actual) return false
  }

  return true
}
