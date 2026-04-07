import {Button} from "@/shared/ui/Button";
import Link from 'next/link'
import { useRouter } from "next/navigation";
import {ROUTES} from "@/shared/constants/route";

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
  onStart: () => void
  isPending: boolean
}

export default function SmokingInterAction({
    setStep,
    onStart,
    isPending
  }: Props) {
  const router = useRouter()

  const handleClick = async () => {
    await onStart()
    router.push(ROUTES.nodamHome)
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant={"outline"}
              className="hover:bg-accent hover:text-accent-foreground text-[16px]"
              size={"xl"}
              fullWidth={true}
              onClick={() => setStep(1)}
      >
        이전
      </Button>
      <Button
        size={"xl"}
        fullWidth
        className="hover:bg-emerald-700 text-[16px]"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "저장 중..." : "금연 시작하기 🚀"}
      </Button>
    </div>
  )
}