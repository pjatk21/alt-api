import { DateTime } from 'luxon'
import React from 'react'
import { ScheduleEntryRawResponse } from '../types'
import styles from './ScheduleBlock.module.sass'
import { colors } from './colors.json'

type ScheduleBlockProps = {
  data: ScheduleEntryRawResponse
}

export function ScheduleBlock({ data }: ScheduleBlockProps) {
  const begin = DateTime.fromISO(data.begin)
  const end = DateTime.fromISO(data.end)
  const timeBegin = begin.startOf('day').plus({ hours: 6 })
  const offset = begin.diff(timeBegin).as('hours')
  const heightByDuration = end.diff(begin).as('hours')
  console.log({ code: data.code, offset, heightByDuration })

  const bgColorByType = colors.filter((c) => c.type === data.type)[0]?.color ?? '#0000FF'

  // WARNING
  // 50 -> 1hr in timeline (elem height + margin (34 + 16))
  // 1 + 10 -> hr size + top padding size
  return (
    <div
      className={styles.timelineBlock}
      style={{
        top: offset * 50 + 1 + 10,
        height: heightByDuration * 50,
        backgroundColor: bgColorByType,
      }}
    >
      <div className={styles.row}>
        <span className={styles.code}>{data.code}</span>
        <span className={styles.room}>{data.room}</span>
      </div>
      <span className={styles.time}>
        od {begin.toLocaleString({ timeStyle: 'short' })} do{' '}
        {end.toLocaleString({ timeStyle: 'short' })}
      </span>
    </div>
  )
}
