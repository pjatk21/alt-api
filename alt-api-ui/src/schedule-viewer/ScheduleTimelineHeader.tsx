import { DateTime } from 'luxon'
import { Text } from '@nextui-org/react'

type ScheduleTimelineHeaderProps = {
    activeDate: DateTime
}

export function ScheduleTimelineHeader({ activeDate }: ScheduleTimelineHeaderProps) {
    return (
        <>
            <Text b>{activeDate.day}</Text>
            <Text css={{ textAlign: 'center' }}>{activeDate.weekdayLong}</Text>
        </>
    )
}
