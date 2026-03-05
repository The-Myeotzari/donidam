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
}
