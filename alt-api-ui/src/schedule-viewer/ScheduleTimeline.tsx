import ky from 'ky'
import { DateTime } from 'luxon'
import React from 'react'
import { useQuery } from 'react-query'
import { ScheduleEntryRawResponse } from '../types'
import { ScheduleBlock } from './ScheduleBlock'
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

const params = new URLSearchParams()
params.append('groups', 'WIs I.2 - 1w')
params.append('groups', 'WIs I.2 - 46c')

const getSchedule: () => Promise<{ entries: ScheduleEntryRawResponse[] }> = () =>
  ky
    .get('https://altapi.kpostek.dev/v1/timetable/date/2022-03-25', {
      searchParams: params,
    })
    .json()

export function ScheduleTimeline() {
  const { data, isLoading } = useQuery('schedule', getSchedule)
  console.log(data)

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.content}>
        {data?.entries.slice(0, 3).map((x) => (
          <ScheduleBlock key={x.begin + x.groups} data={x} />
        ))}
      </div>
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
    </div>
  )
}
