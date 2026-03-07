'use client'

import SmokingStatusCard from "@/features/nodam/ui/SmokingStatusCard";
import {Cigarette, X} from "lucide-react";
import SmokingStatusInfo from "@/features/nodam/ui/SmokingStatusInfo";
import { useState } from "react";

interface Props {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function NodamCheck({setStep}: Props) {
  const [status, setState] = useState<"yes" | "no" | "">("");

  return (
    <div className="space-y-4 mt-4">
      <p className="font-semibold text-base">현재 흡연자이신가요?</p>
      <p className="text-sm text-muted-foreground">금연 도우미 서비스를 위해 확인이 필요해요</p>
      <div className="grid grid-cols-2 gap-3">
        <SmokingStatusCard
          icon={<Cigarette size={36} className="text-primary" />}
          statusText={"네, 흡연자예요"}
          description={"금연을 시작하고\n절약해보고 싶어요"}
          value="yes"
          selectedValue={status}
          onClick={() => setState("yes")}
        />
        <SmokingStatusCard
          icon={<X size={36} className="lucide lucide-x text-muted-foreground" />}
          statusText={"아니요"}
          description={"비흡연자이거나\n이미 끊었어요"}
          value="no"
          selectedValue={status}
          onClick={() => setState("no")}
        />
      </div>
      <div>
        <SmokingStatusInfo status={status} setStep={setStep}/>
      </div>
    </div>
  )
}