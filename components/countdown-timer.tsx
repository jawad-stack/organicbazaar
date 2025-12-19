"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  initialDays?: number
  initialHours?: number
  onComplete?: () => void
}

export function CountdownTimer({ initialDays = 2, initialHours = 10, onComplete }: CountdownTimerProps) {
  const [time, setTime] = useState({
    days: initialDays,
    hours: initialHours,
    minutes: 0,
    seconds: 0,
  })

  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        } else {
          // Timer completed, restart
          setIsRunning(false)
          onComplete?.()
          // Auto-restart after 1 second
          setTimeout(() => {
            setTime({
              days: initialDays,
              hours: initialHours,
              minutes: 0,
              seconds: 0,
            })
            setIsRunning(true)
          }, 1000)
          return prev
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, initialDays, initialHours, onComplete])

  const pad = (num: number) => String(num).padStart(2, "0")

  return (
    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
      <span>{pad(time.days)}d</span>
      <span className="text-muted-foreground">:</span>
      <span>{pad(time.hours)}h</span>
      <span className="text-muted-foreground">:</span>
      <span>{pad(time.minutes)}m</span>
      <span className="text-muted-foreground">:</span>
      <span>{pad(time.seconds)}s</span>
    </div>
  )
}
