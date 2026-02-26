export const ROUTES = {
  auth: '/auth',

  dashboard: '/dashboard',
  dashboardMonthly: '/dashboard/monthly-expenses',
  dashboardTransactions: '/dashboard/transactions',

  autoFill: '/auto-fill',
  autoFillAccountDetail: '/auto-fill/accounts/:accountsId',
  autoFillAddAccounts: '/auto-fill/add-accounts',
  autoFillAddAccountsDetail: '/auto-fill/add-accounts/:accountsId',

  calendar: '/calendar',
  stats: '/stats',

  menu: '/menu',
  menuProfile: '/menu/profile',
  menuSettings: '/menu/settings',
  menuSettingsAlarm: '/menu/settings/alarm',
  menuSettingsPassword: '/menu/settings/password',
  menuSettingsTheme: '/menu/settings/theme',
  menuHelp: '/menu/help',

  service: '/service',

  deokdamOnboarding: '/service/deokdam/onboarding',
  deokdamParentInvite: '/service/deokdam/onboarding/parent/invite',
  deokdamParentDone: '/service/deokdam/onboarding/parent/done',
  deokdamChildAccept: '/service/deokdam/onboarding/child/accept',
  deokdamChildDone: '/service/deokdam/onboarding/child/done',

  deokdamParentHome: '/service/deokdam/parent',
  deokdamParentPromises: '/service/deokdam/parent/promises',
  deokdamParentRecent: '/service/deokdam/parent/recent-deokdam',

  deokdamChildHome: '/service/deokdam/child',
  deokdamChildPromises: '/service/deokdam/child/promises',
  deokdamChildRecent: '/service/deokdam/child/recent-deokdam',

  nodamHome: '/service/nodam',
  nodamOnboarding: '/service/nodam/onboarding',
} as const
