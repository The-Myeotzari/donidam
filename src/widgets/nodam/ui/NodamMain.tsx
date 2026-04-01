import SmokingInformation from "@/features/nodam/ui/SmokingInformation";
import SmokingTodayAction from "@/features/nodam/ui/SmokingTodayAction";
import SmokingChart from "@/features/nodam/ui/SmokingChart";
import SmokingBadge from "@/features/nodam/ui/SmokingBadge";

export default function NodamMain() {
  return (
    <div className="space-y-6">
      <SmokingInformation />
      <SmokingTodayAction />
      <SmokingChart />
      <SmokingBadge />
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm italic">작은 승리가 모여 큰 변화를 만듭니다</p>
      </div>
    </div>
  )
}