import { Loading } from '@nextui-org/react'
import ky from 'ky'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { ScheduleEntryRawResponse } from '../types'
import { ScheduleBlock } from './ScheduleBlock'
import { useInterval } from 'usehooks-ts'
import styles from './ScheduleTimeline.module.sass'

const mockData: ScheduleEntryRawResponse = {
  name: 'Programowanie obiektowe i GUI',
  code: 'GUI',
  type: 'Wykład',
  groups: ['WIs I.2 - 1w'],
  building: 'B2020',
  room: 'B/241',
  begin: '2022-03-24T07:30:00.000Z',
  end: '2022-03-24T09:00:00.000Z',
  tutor: 'Tomaszewski Michał',
}

const mockData2: ScheduleEntryRawResponse = {
  name: 'Algebra liniowa i geometria',
  code: 'ALG',
  type: 'Wykład',
  groups: ['WIs I.2 - 1w'],
  building: 'B2020',
  room: 'B/241',
  begin: '2022-03-24T09:15:00.000Z',
  end: '2022-03-24T10:45:00.000Z',
  tutor: 'Turska Ewa',
}

type ScheduleTimelineProps = {
  date: DateTime
  groups: string[]
}

function timepointerOffset() {
  return DateTime.now()
    .diff(DateTime.now().startOf('day').set({ hour: 6 }))
    .as('hours')
}

function getSchedule(date: DateTime, groups: string[]): Promise<{ entries: ScheduleEntryRawResponse[] }> {
  const params = new URLSearchParams()
  for (const g of groups) params.append('groups', g)

  params.append('from', date.startOf('day').toISO())
  params.append('to', date.endOf('day').toISO())
  return ky
    .get(`https://altapi.kpostek.dev/v1/timetable/range`, {
      searchParams: params,
    })
    .json()
}

export function ScheduleTimeline({ date, groups }: ScheduleTimelineProps) {
  const [timePointer, setTimePoiner] = useState(timepointerOffset())
  useInterval(() => setTimePoiner(timepointerOffset()), 10000)

  const { data, isLoading } = useQuery<
    { entries: ScheduleEntryRawResponse[] },
    Error,
    ScheduleEntryRawResponse[]
  >(['schedule', date], () => getSchedule(date, groups), {
    select: (x) => x.entries,
  })
  console.log(data)

  if (isLoading || groups.length === 0) return <div style={{ display: 'flex', justifyContent: 'center'}}>
    <Loading>Pobieranie planu zajęć</Loading>
  </div>

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.background}>
        {[...Array(22 - 6)].map((x, y) => {
          const h = DateTime.fromObject({ hour: 6 + y })
          return (
            <div key={y} className={styles.line}>
              <span>{h.toLocaleString({ timeStyle: 'short' })}</span>
              <hr />
            </div>
          )
        })}
      </div>
      <div className={styles.content}>
        {data?.map((x) => (
          <ScheduleBlock key={x.begin + x.groups} data={x} />
        ))}
      </div>
      <div className={styles.timePointer}>
        <hr style={{ top: timePointer * 50 + 1 }} />
      </div>
    </div>
  )
}
