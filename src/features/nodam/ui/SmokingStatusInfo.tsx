import { Button } from "@/shared/ui/Button"
import {ArrowRight} from "lucide-react";

interface Status {
  status: string
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function SmokingStatusInfo({ status, setStep }: Status) {
  if (status === "yes") {
    return (
      <div>
        <Button fullWidth={true} size={"xl"} rightIcon={<ArrowRight width={15}/>} onClick={() => setStep(2)}>다음</Button>
      </div>
    )
  }

  if (status === "no") {
    return (
      <div className="bg-muted rounded-xl p-4 text-center animate-fade-in">
        <p className="font-medium">🎉 대단해요!</p>
        <p className="text-sm text-muted-foreground mt-1">이 서비스는 현재 흡연자를 위한 금연 도우미에요.</p>
        <Button variant={"secondary"} className="hover:bg-accent hover:text-accent-foreground mt-3 rounded-xl">다른 서비스 보기</Button>
      </div>
    )
  }

  return null
}