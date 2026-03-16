import { PinLockScreen } from '@/features/verify-pin/ui/PinLockScreen'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <PinLockScreen>{children}</PinLockScreen>
}
