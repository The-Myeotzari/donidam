import {Card} from "@/shared/ui/Card";
import {Badge} from "@/shared/ui/Badge";

export default function SmokingBadge() {
  return (
    <Card className="p-5">
      <p className="font-semibold mb-4">도전 배지</p>
      <div className="flex flex-wrap gap-2">
        <Badge className={"px-4 py-2 rounded-3xl text-center text-sm font-medium transition-all bg-emerald-700 text-foreground"}>
          <Badge.Text>☀️ 첫 24시간!</Badge.Text>
        </Badge>
        <Badge className={"px-4 py-2 rounded-3xl text-center text-sm font-medium transition-all bg-emerald-700 text-foreground"}>
          <Badge.Text>💪 3일 달성</Badge.Text>
        </Badge>
        <Badge className={"px-4 py-2 rounded-3xl text-center text-sm font-medium transition-all bg-emerald-700 text-foreground"}>
          <Badge.Text>🎉 1주일 완료!</Badge.Text>
        </Badge>
        <Badge className={"px-4 py-2 rounded-3xl text-center text-sm font-medium transition-all bg-muted text-muted-foreground opacity-60"}>
          <Badge.Text>🔒 2주 성공!</Badge.Text>
        </Badge>
        <Badge className={"px-4 py-2 rounded-3xl text-center text-sm font-medium transition-all bg-muted text-muted-foreground opacity-60"}>
          <Badge.Text>🔒 한달 금연!</Badge.Text>
        </Badge>
      </div>
    </Card>
  )
}