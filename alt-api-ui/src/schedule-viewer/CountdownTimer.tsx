import { Card } from '@nextui-org/react'
import { useState } from 'react'
import { useInterval } from 'usehooks-ts'
import type { AltapiScheduleEntry } from './../altapi'

type CountdownTimerProps = {
  currentScheduledLessons: AltapiScheduleEntry[]
}

export function CountdownTimer({ currentScheduledLessons }: CountdownTimerProps) {
  const active = currentScheduledLessons.find((x) => x.isActive)

  if (!active) return null

  const [timeLeft, setTimeLeft] = useState(active.end.diffNow())
  useInterval(() => setTimeLeft(active.end.diffNow()), 200)

  return (
    <Card>
      Do końca {active.code} pozostało:{' '}
      {timeLeft.shiftTo('minutes', 'seconds').toHuman({ maximumFractionDigits: 0 })}
    </Card>
  )
}
