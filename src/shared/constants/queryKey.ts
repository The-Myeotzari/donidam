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
}
