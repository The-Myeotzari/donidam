import {Input} from "@/shared/ui/Input";

interface Props {
  text: string
  value: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}

export default function SmokingInput({ text, value, setInput }: Props) {
  return (
    <>
      <Input size={"lg"}>
        <p className="text-sm font-medium mb-1.5 block">{text}</p>
        <Input.Field type="number" value={value} placeholder={value} onChange={(e) => setInput(e.target.value)}/>
      </Input>
    </>
  )
}