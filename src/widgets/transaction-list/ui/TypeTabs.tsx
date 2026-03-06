import { TabsList, TabsRoot, TabsTrigger } from '@/shared/ui/Tabs'

export function TypeTabs() {
  return (
    <TabsRoot defaultValue="all" searchParamKey="type" className="mb-4">
      <TabsList className="bg-muted rounded-xl p-1">
        <TabsTrigger value="all">전체</TabsTrigger>
        <TabsTrigger value="IN">수입</TabsTrigger>
        <TabsTrigger value="OUT">지출</TabsTrigger>
      </TabsList>
    </TabsRoot>
  )
}
