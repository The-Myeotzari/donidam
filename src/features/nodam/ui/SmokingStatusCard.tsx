import {Card} from "@/shared/ui/Card";
import { LucideIcon } from "lucide-react"
import React from "react";
import cn from "@/shared/lib/cn";

interface Status {
  icon: React.ReactNode
  statusText: string
  description: string
  background?: "default" | "primary" | "secondary" | "family" | "success"
  onClick: () => void
  value: "yes" | "no"
  selectedValue: "yes" | "no" | ""
}

export default function SmokingStatusCard({
  icon,
  statusText,
  description,
  background,
  onClick,
  value,
  selectedValue,
}: Status) {
  const isSelected = selectedValue === value

  return (
    <Card
      variant={background}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center p-5 py-8 gap-3 transition-all duration-200 hover:float-shadow hover:-translate-y-1 cursor-pointer',
        {
          'bg-[rgba(38,191,149,0.1)]': selectedValue === 'yes',
          'bg-muted':selectedValue === 'no',
          'bg-card': !isSelected,
        }
      )}>
      {icon}
      <p className="font-semibold text-base">{statusText}</p>
      <p className="text-xs text-muted-foreground text-center whitespace-pre-line">
        {description}
      </p>
    </Card>
  )
}