'use client'
import {Button} from "@/shared/ui/Button";
import {useState} from "react";
import {Card} from "@/shared/ui/Card";
import {Check} from 'lucide-react'

export default function SmokingTodayAction() {
  const [actionStatus, setActionStatus] = useState(false)
  return (
    <>
      {actionStatus ? (
       <Card className="bg-muted rounded-xl p-4 text-center flex flex-col items-center justify-center">
         <Check className="text-primary"/>
         <p className="font-medium mt-2">오늘 기록 완료!</p>
         <p className="text-sm text-muted-foreground  mt-2">내일 다시 확인해주세요</p>
       </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button variant="white"
                  className="font-bold text-base"
                  size={"xl"}
                  fullWidth={true}
                  onClick={() => setActionStatus(true)}
          >
            금연 성공!
          </Button>
          <Button variant="outline"
                  className="hover:bg-accent
              hover:text-accent-foreground
              text-base" size={"xl"}
                  fullWidth={true}
                  onClick={() => setActionStatus(true)}
          >
            흡연했어요
          </Button>
        </div>
      )}
    </>

  )
}