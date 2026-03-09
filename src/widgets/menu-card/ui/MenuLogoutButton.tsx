'use client'

import { createClient } from '@/shared/lib/supabase/client'
import { Card } from '@/shared/ui/Card'
import { LogOut } from 'lucide-react'

export function MenuLogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()

    const { data } = await supabase.auth.getSession()
    console.log(data.session) // null이면 로그아웃 OK
    location.href = '/auth'
  }

  return (
    <Card hoverable onClick={handleLogout} className="p-4 text-(--destructive)">
      <div className="flex items-center gap-3 text-destructive">
        <div className="w-9 h-9 rounded-xl bg-(--destructive)/10 flex items-center justify-center shrink-0">
          <LogOut size={18} />
        </div>
        <span className="font-medium text-sm">로그아웃</span>
      </div>
    </Card>
  )
}
