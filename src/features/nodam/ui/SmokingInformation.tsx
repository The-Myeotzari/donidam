import {Card} from "@/shared/ui/Card";

export default function SmokingInformation() {
  return (
    <Card variant="default" className="rounded-2xl p-5 card-shadow transition-all duration-300 bg-card space-y-4">
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1">건강한 내일을 위해!</p>
          <p className="text-5xl font-bold">0<span className="text-xl font-semibold ml-1">일</span></p>
          <p className="text-sm text-muted-foreground mt-1">금연 중이에요!</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl p-5 card-shadow transition-all duration-300 bg-card text-center py-3">
            <p className="text-lg font-bold">0원</p>
            <p className="text-[12px] text-muted-foreground">절약한 금액</p>
          </div>
          <div className="rounded-2xl p-5 card-shadow transition-all duration-300 bg-card text-center py-3">
            <p className="text-lg font-bold">0개비</p>
            <p className="text-[12px] text-muted-foreground">피우지 않은 담배</p>
          </div>
        </div>
      </div>
    </Card>
  )
}