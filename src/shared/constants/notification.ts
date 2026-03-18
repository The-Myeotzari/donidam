// =====================================================================
// 돈이담 알림 정책 - 유형별 메시지 템플릿
// =====================================================================

// A. 예산 관리형
export const BUDGET_TEMPLATES = {
  /** 경과일% - 소진율% >= 10 → 순항 */
  sailing: (burnRate: number) => ({
    title: '돈이담이 넉넉해요! ✨',
    body: `현재 예산의 ${burnRate}%만 사용하셨네요. 아주 여유로운 흐름이에요!`,
    deepLink: '/',
  }),
  /** 소진율 > 경과일% → 속도 초과 */
  speeding: (burnRate: number) => ({
    title: '조금 빨라요! 속도 조절 ⚠️',
    body: `벌써 예산의 ${burnRate}%를 썼어요. 오늘은 조금만 아껴볼까요?`,
    deepLink: '/',
  }),
  /** 80 / 90 / 100% 임계치 */
  threshold: (burnRate: number, remainingDays: number, dailyLimit: number) => ({
    title: '비상! 예산이 얼마 남지 않았어요 🚨',
    body: `남은 ${remainingDays}일 동안 하루 ${dailyLimit.toLocaleString()}원만 쓸 수 있어요. (소진 ${burnRate}%)`,
    deepLink: '/',
  }),
} as const

// B. 통계 인사이트형
export const STATS_TEMPLATES = {
  /** 매주 월요일 - 전주 카테고리 비교 */
  weeklyCategory: (category: string, changePercent: number) => ({
    title: `지난주 ${category}이(가) ${changePercent}% 증가했어요 🍔`,
    body: `지난주엔 ${category}에 집중하셨네요! 이번 주 지출 패턴을 확인해 보세요.`,
    deepLink: '/stats',
  }),
  /** 주말 지출 > 평일 2배 */
  weekendSpike: () => ({
    title: '주말 보상 소비 주의보! 🛍️',
    body: '주말 지출이 평일보다 2배 많아요. 지갑이 숨 쉴 틈을 주세요!',
    deepLink: '/stats',
  }),
  /** 매달 1일 고정비 체킹 */
  fixedCost: (fixedRatio: number) => ({
    title: `이번 달 고정비는 ${fixedRatio}%예요`,
    body: '구독 서비스와 공과금으로 이만큼 나갔어요. 확인해 보세요!',
    deepLink: '/stats',
  }),
} as const

// C. 리텐션 유도형
export const RETENTION_TEMPLATES = {
  /** 21:30 당일 기록 0건 */
  noRecord: () => ({
    title: '오늘의 소비, 담으셨나요? 💰',
    body: '잊기 전에 오늘의 지출을 기록하고 깔끔하게 하루를 마무리해요.',
    deepLink: '/',
  }),
  /** 23:00 당일 0원 */
  zeroSpending: () => ({
    title: '와우! 오늘 지출 0원 성공! 🎉',
    body: '오늘 하루 정말 잘 참으셨어요. 내일도 이 기운 그대로!',
    deepLink: '/',
  }),
} as const

// D. 덕담 (부모-자녀 용돈 서비스)
export const DUKDAM_TEMPLATES = {
  /** 약속 달성 → 부모 알림 */
  promiseAchieved: (childName: string, promiseTitle: string) => ({
    title: '약속을 지켰어요! 🏆',
    body: `${childName}님이 '${promiseTitle}'을 완료했습니다. 약속한 보상 금액을 보내주시겠어요?`,
    deepLink: '/dukdam',
  }),
  /** 정기 용돈 전날 → 부모 알림 */
  allowanceScheduled: (childName: string, amount: number) => ({
    title: '내일은 용돈 주는 날! 🗓️',
    body: `내일 ${childName}님에게 ${amount.toLocaleString()}원이 자동 이체될 예정입니다. 따뜻한 한마디도 함께 담아보세요.`,
    deepLink: '/dukdam',
  }),
  /** 용돈 수령 → 자녀 알림 */
  allowanceReceived: (parentNickname: string, message: string) => ({
    title: '덕담이 도착했습니다! 💌',
    body: `${parentNickname}님이 "${message}"와 함께 용돈을 보내셨어요. 감사 인사를 전해볼까요?`,
    deepLink: '/dukdam',
  }),
  /** 잔액 부족 → 자녀 알림 */
  lowBalance: (remainingAmount: number) => ({
    title: '용돈 항아리가 비어 가요 🪹',
    body: `이번 달 용돈이 ${remainingAmount.toLocaleString()}원 남았습니다. 다음 용돈 날까지 계획적으로 써보세요!`,
    deepLink: '/dukdam',
  }),
} as const

// E. 노담 (금연 지원)
export const NODAM_TEMPLATES = {
  /** 매일 저녁 성공 축하 */
  dailySuccess: (days: number, savedAmount: number, goalItem: string) => ({
    title: "오늘도 '노담' 성공! ✨",
    body: `벌써 ${days}일째예요! 오늘 아낀 담뱃값 ${savedAmount.toLocaleString()}원은 ${goalItem}을 위해 차곡차곡 쌓이고 있어요.`,
    deepLink: '/nodam',
  }),
  /** 배지 획득 */
  badgeEarned: (badgeName: string, savedAmount: number) => ({
    title: '새로운 훈장을 땄어요! 🏅',
    body: `'${badgeName}' 배지를 획득하셨습니다! ${savedAmount.toLocaleString()}원만큼 건강과 지갑을 지켜내셨네요.`,
    deepLink: '/nodam',
  }),
  /** 위기 극복 유도 */
  stayStrong: (totalSaved: number) => ({
    title: '지금 흔들리고 있다면? 🚭',
    body: `지금까지 아낀 돈 ${totalSaved.toLocaleString()}원을 생각하세요! 담배 한 대 대신 물 한 잔 어떠세요?`,
    deepLink: '/nodam',
  }),
  /** 주간 리포트 */
  weeklyReport: (weekSaved: number) => ({
    title: '이번 주 노담 리포트 📈',
    body: `일주일간 담배 대신 ${weekSaved.toLocaleString()}원을 저축하셨습니다. '돈이담'이 당신의 도전을 응원합니다!`,
    deepLink: '/nodam',
  }),
} as const

// 방해 금지 시간대 확인 (22:00 ~ 08:00 KST)
export function isQuietHours(): boolean {
  const now = new Date()
  // UTC+9 변환
  const kstHour = (now.getUTCHours() + 9) % 24
  return kstHour >= 22 || kstHour < 8
}
