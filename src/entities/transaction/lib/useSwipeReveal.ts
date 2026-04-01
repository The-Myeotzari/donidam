import { useEffect, useRef, useState } from 'react'

export function useSwipeReveal(actionWidth: number) {
  const [offset, setOffset] = useState(0)
  const isOpen = offset === actionWidth

  const containerRef = useRef<HTMLLIElement>(null)
  const touchStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  // 바깥 클릭/터치 시 닫기
  useEffect(() => {
    if (!isOpen) return
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOffset(0)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    isDragging.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.touches[0].clientX
    if (Math.abs(delta) > 5) isDragging.current = true
    setOffset(Math.max(0, Math.min(delta + (isOpen ? actionWidth : 0), actionWidth)))
  }

  const handleTouchEnd = () => {
    setOffset(offset > actionWidth / 2 ? actionWidth : 0)
    touchStartX.current = null
  }

  const handleClick = () => {
    if (isDragging.current) return
    setOffset((prev) => (prev === actionWidth ? 0 : actionWidth))
  }

  const close = () => setOffset(0)

  return {
    containerRef,
    offset,
    isDragging,
    close,
    handlers: { onClick: handleClick, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd },
  }
}
