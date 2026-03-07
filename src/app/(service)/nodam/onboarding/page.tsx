'use client'

import NodamCheck from "@/widgets/nodam/ui/NodamCheck";
import NodamStart from "@/widgets/nodam/ui/NodamStart";
import { useState } from "react";

export default function Page () {
  const [step, setStep] = useState<number>(1);

  return (
    <>
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