import {Card} from "@/shared/ui/Card";

interface Props {
  count: number
  price: number
}

export default function SmokingMoney({count, price} : Props) {
  const savingPrice = Math.round((count / 20) * price)

  return (
    <Card className="p-5 text-center">
      <p className="text-sm text-muted-foreground">예상 일일 절약 금액</p>
      <p className="text-2xl font-bold mt-1">{savingPrice.toLocaleString()}원</p>
    </Card>
  )
}