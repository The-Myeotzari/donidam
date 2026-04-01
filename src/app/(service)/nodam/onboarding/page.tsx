'use client'

import NodamCheck from "@/widgets/nodam/ui/NodamCheck";
import NodamStart from "@/widgets/nodam/ui/NodamStart";
import { Header } from '@/shared/layout/header/Header'
import { useState } from "react";

export default function Page () {
  const [step, setStep] = useState<number>(1);

  return (
    <>
      <Header back={true} title={'노담 시작하기'} subtitle={"담배 끊고, 돈도 모으고!"} />
      {
        step === 1 ? (
          <>
            <NodamCheck setStep={setStep}/>
          </>
        ) : (
          <>
            <NodamStart setStep={setStep}/>
          </>
        )
      }
    </>
  )
}