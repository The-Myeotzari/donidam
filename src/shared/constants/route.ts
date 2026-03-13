export const ROUTES = {
  auth: '/auth',

  dashboard: '/',
  dashboardMonthly: '/monthly-expenses',
  dashboardTransactions: '/transactions',

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
  menuSettingsCard: '/menu/settings/card',
  menuSettingsTheme: '/menu/settings/theme',
  menuHelp: '/menu/help',

  service: '/service',

  deokdamOnboarding: '/deokdam/onboarding',
  deokdamParentInvite: '/deokdam/onboarding/parent/invite',
  deokdamParentDone: '/deokdam/onboarding/parent/done',
  deokdamChildAccept: '/deokdam/onboarding/child/accept',
  deokdamChildDone: '/deokdam/onboarding/child/done',

  deokdamParentHome: '/deokdam/parent',
  deokdamParentPromises: '/deokdam/parent/promises',
  deokdamParentRecent: '/deokdam/parent/recent-deokdam',

  deokdamChildHome: '/deokdam/child',
  deokdamChildPromises: '/deokdam/child/promises',
  deokdamChildRecent: '/deokdam/child/recent-deokdam',

  nodamHome: '/nodam',
  nodamOnboarding: '/nodam/onboarding',
} as const
