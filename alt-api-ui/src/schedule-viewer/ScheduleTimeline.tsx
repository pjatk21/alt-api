import { Loading } from '@nextui-org/react'
import ky from 'ky'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { ScheduleEntryRawResponse } from '../types'
import { ScheduleBlock } from './ScheduleBlock'
import { useInterval } from 'usehooks-ts'
import styles from './ScheduleTimeline.module.sass'
import { baseUrl } from '../util'

type ScheduleTimelineProps = {
  date: DateTime
  groups: string[]
}

function timepointerOffset() {
  return DateTime.now()
    .diff(DateTime.now().startOf('day').set({ hour: 6 }))
    .as('hours')
}

function getSchedule(
  date: DateTime,
  groups: string[],
): Promise<{ entries: ScheduleEntryRawResponse[] }> {
  if (groups.length === 0) return Promise.resolve({ entries: [] })

  const params = new URLSearchParams()
  for (const g of groups) params.append('groups', g)

  params.append('from', date.startOf('day').toISO())
  params.append('to', date.endOf('day').toISO())
  return ky
    .get(`${baseUrl}v1/timetable/range`, {
      searchParams: params,
    })
    .json()
}

function describeDay(entries: ScheduleEntryRawResponse[]) {
  if (entries.length === 0) return 'Nie ma zaplanowanych zajęć na ten dzień.'
  const begin = DateTime.fromISO(entries[0].begin)
  const end = DateTime.fromISO(entries.slice(-1)[0].end)
  const duration = end.diff(begin).shiftTo('hours')

  return `Na ten dzień zaplanowano ${entries.length} zajęcia, w godzinach ${begin.toLocaleString({ timeStyle: 'short' })} - ${end.toLocaleString({ timeStyle: 'short' })} trwające łącznie ${duration.toHuman()}`
}

export function ScheduleTimeline({ date, groups }: ScheduleTimelineProps) {
  const [timePointer, setTimePoiner] = useState(timepointerOffset())
  useInterval(() => setTimePoiner(timepointerOffset()), 5000)

  const { data, isLoading } = useQuery<
    { entries: ScheduleEntryRawResponse[] },
    Error,
    ScheduleEntryRawResponse[]
  >(['schedule', date, groups], () => getSchedule(date, groups), {
    select: (x) => x.entries,
  })

  if (isLoading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Loading>Pobieranie planu zajęć</Loading>
      </div>
    )

  return (
    <>
      {data && <p>{describeDay(data)}</p>}
      <div className={styles.timelineContainer}>
        <div className={styles.background}>
          {[...Array(22 - 6)].map((x, y) => {
            const h = DateTime.fromObject({ hour: 6 + y })
            return (
              <div key={y} className={styles.line}>
                <div>
                  <span>
                    {h.toLocaleString({ timeStyle: 'short', hourCycle: 'h24' })}
                  </span>
                </div>
                <hr />
              </div>
            )
          })}
        </div>
        <div className={styles.content}>
          {data?.map((x, y) => (
            <ScheduleBlock key={y} data={x} />
          ))}
        </div>
        {DateTime.now().startOf('day').plus({ hours: 6 }) < date &&
          DateTime.now().startOf('day').plus({ hours: 21 }) > date && (
            <div className={styles.timePointer}>
              <hr style={{ top: timePointer * 55 + 1 }} />
            </div>
          )}
      </div>
    </>
  )
}
