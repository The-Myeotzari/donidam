import { HEADER_ROUTES, type HeaderConfig } from '@/shared/layout/header/header.routes'
import { matchRoute } from '@/shared/layout/header/matchRoute'

export function getHeaderConfig(pathname: string): HeaderConfig | undefined {
  return HEADER_ROUTES.find((r) => matchRoute(r.pattern, pathname))
}
