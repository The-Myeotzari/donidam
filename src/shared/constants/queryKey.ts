export const QUERY_KEYS = {
  MOCK: {
    mockList: ['mock', 'list'] as const,
  },
  DASHBOARD: {
    all: ['dashboard-card'] as const,
    mainCard: (month?: string) => ['dashboard-card', 'main', month ?? 'current'] as const,
  },
  BUDGET: {
    all: ['budget'] as const,
    current: () => ['budget', 'current'] as const,
  },
  SPENDING_BY_CATEGORY: {
    all: ['spending-by-category'] as const,
    byMonth: (month?: string) => ['spending-by-category', month ?? 'current'] as const,
  },
  TRANSACTIONS: {
    all: ['transactions'] as const,
    recent: (limit?: number) => ['transactions', 'recent', limit ?? 5] as const,
    list: (params?: Record<string, string>) => ['transactions', 'list', params ?? {}] as const,
  },

  STATS: {
    summary: (month?: string) => ['stats', 'summary', month ?? 'current'] as const,
    dailyTrend: (month?: string) => ['stats', 'daily-trend', month ?? 'current'] as const,
  },
  PAYMENT_METHODS: {
    all: ['payment-methods'] as const,
    list: () => ['payment-methods', 'list'] as const,
  },

  DEOKDAM: {
    all: ['deokdam'] as const,
    parentSummary: (month?: string) => ['deokdam', 'parent', 'summary', month ?? 'current'] as const,
    parentPromises: (status?: string) => ['deokdam', 'parent', 'promises', status ?? 'ALL'] as const,
    parentAllowances: (type?: string) => ['deokdam', 'parent', 'allowances', type ?? 'all'] as const,
    autoSettings: ['deokdam', 'parent', 'auto-settings'] as const,
    children: ['deokdam', 'parent', 'children'] as const,
    childSummary: (month?: string) => ['deokdam', 'child', 'summary', month ?? 'current'] as const,
    childPromises: (status?: string) => ['deokdam', 'child', 'promises', status ?? 'ALL'] as const,
    childAllowances: (type?: string) => ['deokdam', 'child', 'allowances', type ?? 'all'] as const,
  },
}
