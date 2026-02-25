import { ROUTES } from '@/shared/constants/route'

export type HeaderConfig = {
  pattern: string // 매칭용 패턴
  title?: string // 기본 타이틀 (커스텀 페이지면 undefined로 두고 페이지에서 주입)
  subtitle?: string // 서브타이틀
  backTo?: string // 뒤로가기 버튼 클릭 시 이동할 경로
  hide?: boolean // 기본 헤더 숨김
}

export const HEADER_ROUTES: HeaderConfig[] = [
  // auth
  { pattern: ROUTES.auth, hide: true },

  // (main) dashboard
  { pattern: ROUTES.dashboard, hide: true },
  {
    pattern: ROUTES.dashboardMonthly,
    title: undefined, // 커스텀 주입
    subtitle: undefined,
    backTo: ROUTES.dashboard,
  },
  {
    pattern: ROUTES.dashboardTransactions,
    title: undefined,
    subtitle: undefined,
    backTo: ROUTES.dashboard,
  },

  // (main) auto-fill
  {
    pattern: ROUTES.autoFill,
    title: '자동 기입',
    subtitle: '은행 계좌를 연결하고 자동으로 가계부를 작성하세요',
  },
  {
    pattern: ROUTES.autoFillAccountDetail,
    title: undefined, // 커스텀 주입
    backTo: ROUTES.autoFill,
  },
  {
    pattern: ROUTES.autoFillAddAccountsDetail,
    title: '추가하기',
    backTo: ROUTES.autoFill,
  },
  {
    pattern: ROUTES.autoFillAddAccounts,
    title: '추가하기',
    backTo: ROUTES.autoFill,
  },

  // (main) calendar
  {
    pattern: ROUTES.calendar,
    title: '캘린더',
    subtitle: '날짜별 거래 내역을 확인해보세요',
  },

  // (main) stats
  {
    pattern: ROUTES.stats,
    title: '통계',
    subtitle: '나의 소비 패턴을 분석해요',
  },

  // (main) menu
  {
    pattern: ROUTES.menu,
    title: '더보기',
    subtitle: '계정 및 서비스 관리',
  },
  {
    pattern: ROUTES.menuProfile,
    title: '내정보',
    subtitle: '프로필 및 계정을 관리하세요',
    backTo: ROUTES.menu,
  },
  {
    pattern: ROUTES.menuSettings,
    title: '설정',
    subtitle: '앱 환경을 설정하세요',
    backTo: ROUTES.menu,
  },
  {
    pattern: ROUTES.menuSettingsAlarm,
    title: '알림 설정',
    subtitle: '알림 수신 방법을 설정하세요',
    backTo: ROUTES.menuSettings,
  },
  {
    pattern: ROUTES.menuSettingsPassword,
    title: '보안 설정',
    subtitle: '계정 보안을 관리하세요',
    backTo: ROUTES.menuSettings,
  },
  {
    pattern: ROUTES.menuSettingsTheme,
    title: '테마',
    subtitle: '앱 테마를 선택하세요',
    backTo: ROUTES.menuSettings,
  },
  {
    pattern: ROUTES.menuHelp,
    title: '도움말',
    subtitle: '자주 묻는 질문',
    backTo: ROUTES.menu,
  },

  // (service)
  {
    pattern: ROUTES.service,
    title: '서비스',
    subtitle: '다양한 금융 서버스를 이용해보세요',
    backTo: ROUTES.menu,
  },

  // (service) deokdam
  {
    pattern: ROUTES.deokdamOnboarding,
    title: '덕담 시작하기',
    subtitle: '따뜻한 용돈, 따뜻한 마음',
  },
  {
    pattern: ROUTES.deokdamParentInvite,
    title: '덕담 시작하기',
    subtitle: '따뜻한 용돈, 따뜻한 마음',
  },
  {
    pattern: ROUTES.deokdamParentDone,
    title: '덕담 시작하기',
    subtitle: '따뜻한 용돈, 따뜻한 마음',
  },
  {
    pattern: ROUTES.deokdamChildAccept,
    title: '덕담 시작하기',
    subtitle: '따뜻한 용돈, 따뜻한 마음',
  },
  {
    pattern: ROUTES.deokdamChildDone,
    title: '덕담 시작하기',
    subtitle: '따뜻한 용돈, 따뜻한 마음',
  },

  {
    pattern: ROUTES.deokdamParentHome,
    title: '덕담',
    subtitle: '따뜻한 용돈, 따뜻한 마음',
    backTo: ROUTES.service,
  },
  {
    pattern: ROUTES.deokdamParentPromises,
    title: '보상 약속 전체보기',
    backTo: ROUTES.deokdamParentHome,
  },
  {
    pattern: ROUTES.deokdamParentRecent,
    title: '덕담 내역 전체보기',
    backTo: ROUTES.deokdamParentHome,
  },

  {
    pattern: ROUTES.deokdamChildHome,
    title: '덕담',
    subtitle: '따뜻한 용돈, 따뜻한 마음',
    backTo: ROUTES.service,
  },
  {
    pattern: ROUTES.deokdamChildPromises,
    title: '약속 전체 보기',
    backTo: ROUTES.deokdamChildHome,
  },
  { pattern: ROUTES.deokdamChildRecent, title: '덕담 전체 보기', backTo: ROUTES.deokdamChildHome },

  // (service) nodam
  {
    pattern: ROUTES.nodamHome,
    title: '노담',
    subtitle: '담배 끊고, 돈도 모으고!',
    backTo: ROUTES.service,
  },
  { pattern: ROUTES.nodamOnboarding, title: '노담 시작하기', subtitle: '담배 끊고, 돈도 모으고!' },
]
