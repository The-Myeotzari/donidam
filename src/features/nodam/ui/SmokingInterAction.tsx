import {Button} from "@/shared/ui/Button";

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function SmokingInterAction({setStep}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button variant={"outline"}
              className="hover:bg-accent hover:text-accent-foreground"
              size={"xl"}
              fullWidth={true}
              onClick={() => setStep(1)}
      >
        이전
      </Button>
      <Button size={"xl"} fullWidth={true}>금연 시작하기 🚀</Button>
    </div>
  )
}