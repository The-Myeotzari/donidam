import NodamMain from "@/widgets/nodam/ui/NodamMain";
import { Header } from '@/shared/layout/header/Header'

export default function Page() {
  return (
    <>
      <Header back={true} title={'노담'} subtitle={"담배 끊고, 돈도 모으고!"} />
      <NodamMain />
    </>
  )
}