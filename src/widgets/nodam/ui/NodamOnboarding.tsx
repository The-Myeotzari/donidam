import SmokingStatusCard from "@/features/nodam/ui/SmokingStatusCard";

export default function NodamOnboarding() {
  return (
    <>
      <SmokingStatusCard iconSrc={""} statusText={"네, 흡연자예요"} description={"금연을 시작하고 절약해보고 싶어요"} />
      <SmokingStatusCard iconSrc={""} statusText={"아니요"} description={"비흡연자이거나 이미 끊었어요"} />
    </>
  )
}