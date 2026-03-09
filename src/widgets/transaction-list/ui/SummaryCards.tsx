type SummaryCardsProps = {
  totalIncome: number
  totalExpense: number
}

//  요약 카드
export function SummaryCards({ totalIncome, totalExpense }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-card rounded-2xl p-4 card-shadow">
        <p className="text-xs text-muted-foreground mb-1">총 수입</p>
        <p className="text-base font-bold text-primary">+{totalIncome.toLocaleString('ko-KR')}원</p>
      </div>
      <div className="bg-card rounded-2xl p-4 card-shadow">
        <p className="text-xs text-muted-foreground mb-1">총 지출</p>
        <p className="text-base font-bold text-destructive">
          -{totalExpense.toLocaleString('ko-KR')}원
        </p>
      </div>
    </div>
  )
}
