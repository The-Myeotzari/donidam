import Image from "next/image";

interface Status {
  iconSrc: string
  statusText: string
  description: string
}

export default function SmokingStatusCard(props : Status) {
  return (
    <div>
      <Image src={props.iconSrc} alt="아이콘"/>
      <p>{props.statusText}</p>
      <p>{props.description}</p>
    </div>
  )
}