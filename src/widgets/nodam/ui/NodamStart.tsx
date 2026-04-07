'use client'

import SmokingInput from "@/features/nodam/ui/SmokingInput";
import SmokingMoney from "@/features/nodam/ui/SmokingMoney";
import { useState } from "react";
import SmokingInterAction from "@/features/nodam/ui/SmokingInterAction";
import {useStartQuit} from "@/features/nodam/api/onBoarding";

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function NodamStart({setStep}: Props) {
  const [count, setCount] = useState<string>("20")
  const [price, setPrice] = useState<string>("4500")

  const {mutate: startQuit, isPending} = useStartQuit()

  const handleStart = () => {
    startQuit(
      {
        dailySmokeCost: Number(price),
        dailySmokeCount: Number(count)
      }
    )
  }

  return (
    <div className="space-y-4 mt-4">
      <p className="font-semibold text-base">흡연 습관을 알려주세요</p>
      <p className="text-sm text-muted-foreground">절약 금액을 정확히 계산하기 위해 필요해요</p>
      <SmokingInput text={"하루 흡연량 (개비)"} value={count} setInput={setCount}/>
      <SmokingInput text={"담배 한 갑 가격 (원)"} value={price} setInput={setPrice}/>
      <SmokingMoney count={Number(count)} price={Number(price)} />
      <SmokingInterAction
        setStep={setStep}
        onStart={handleStart}
        isPending={isPending}
      />
    </div>
  )
}