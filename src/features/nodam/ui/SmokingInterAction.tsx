import {Button} from "@/shared/ui/Button";
import Link from 'next/link'
import {ROUTES} from "@/shared/constants/route";

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function SmokingInterAction({setStep}: Props) {
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
      <Button size={"xl"} fullWidth={true} className='hover:bg-emerald-700'><Link href={ROUTES.nodamHome} className="text-[16px]">금연 시작하기 🚀</Link></Button>
    </div>
  )
}