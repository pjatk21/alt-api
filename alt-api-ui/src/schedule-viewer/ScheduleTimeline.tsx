import { Loading, Spacer, Text, Card, Code } from '@nextui-org/react'
import ky from 'ky'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { ScheduleBlock } from './ScheduleBlock'
import { useInterval, useReadLocalStorage } from 'usehooks-ts'
import styles from './ScheduleTimeline.module.sass'
import { baseUrl } from '../util'
import type { SettingsOptions } from './Settings'
import { AltapiScheduleEntry } from '../altapi'
import { plainToInstance } from 'class-transformer'
import { ModeChoice } from './pickers/ChoicePicker'

type ScheduleTimelineProps = {
  date: DateTime
  queryData: string[]
  choice: ModeChoice
}

function timepointerOffset() {
  return DateTime.now()
    .diff(DateTime.now().startOf('day').set({ hour: 6 }))
    .as('hours')
}

function getSchedule(
  date: DateTime,
  queryData: string[],
  choice: ModeChoice,
): Promise<{ entries: AltapiScheduleEntry[] }> {
  if (queryData.length === 0) return Promise.resolve({ entries: [] })

  const params = new URLSearchParams()
  const queryOperationMode = choice === ModeChoice.TUTOR ? 'tutors' : 'groups'
  for (const q of queryData) params.append(queryOperationMode, q)

  params.append('from', date.startOf('day').toISO())
  params.append('to', date.endOf('day').toISO())
  return ky
    .get(`${baseUrl}v1/timetable/range`, {
      searchParams: params,
    })
    .json<{ entries: unknown[] }>()
    .then((body) => ({
      entries: plainToInstance(AltapiScheduleEntry, body.entries).sort((x, y) =>
        x.begin.diff(y.begin).as('milliseconds'),
      ),
    }))
}

function describeDayPositively(entries: AltapiScheduleEntry[]) {
  if (entries.length === 0) return 'ten dzień jest wolny od zajęć 😌'
  if (entries.filter((x) => x.type === 'Ćwiczenia').length === 0)
    return 'dziś można spokojnie zostać w domku 😌'
  return `na ten dzień są zaplanowane jedynie ✨${entries.length}✨ zajęcia`
}

function describeDay(entries: AltapiScheduleEntry[]) {
  if (entries.length === 0) return 'Nie ma zaplanowanych zajęć na ten dzień.'
  const begin = entries[0].begin
  const end = entries.slice(-1)[0].end
  const duration = end.diff(begin).shiftTo('hours')

  return `Na ten dzień zaplanowano ${
    entries.length
  } zajęcia, w godzinach ${begin.toLocaleString({
    timeStyle: 'short',
  })} - ${end.toLocaleString({
    timeStyle: 'short',
  })} trwające łącznie ${duration.toHuman()}`
}

function useTimePointer() {
  const [timePointer, setTimePoiner] = useState(timepointerOffset())
  useInterval(() => setTimePoiner(timepointerOffset()), 2000)
  return timePointer
}

export function ScheduleTimeline({ date, queryData, choice }: ScheduleTimelineProps) {
  const { hour, minute, second } = DateTime.now().toObject()
  const mockedTime = DateTime.fromObject({ ...date.toObject(), hour, minute, second })

  const settings = useReadLocalStorage<SettingsOptions>('settings')
  const timePointer = useTimePointer()

  // load current day
  const { data, error, isLoading } = useQuery<
    { entries: AltapiScheduleEntry[] },
    Error,
    AltapiScheduleEntry[]
  >(['schedule', date, queryData, choice], () => getSchedule(date, queryData, choice), {
    select: (x) => x.entries,
  })

  // preload next day
  useQuery(['schedule', date.plus({ day: 1 }), queryData, choice], () =>
    getSchedule(date.plus({ day: 1 }), queryData, choice),
  )

  if (isLoading)
    return (
      <Card>
        <Loading color={'primary'} textColor={'primary'}>
          Pobieranie planu zajęć
        </Loading>
      </Card>
    )

  if (error)
    return (
      <Card color={'error'}>
        {'🧰'} {error.name} - {error.message}
        <Code>{error.stack}</Code>
      </Card>
    )

  return (
    <>
      {data && (
        <Text blockquote>
          {settings?.olaMode ? describeDayPositively(data) : describeDay(data)}
        </Text>
      )}
      <Spacer />
      <div className={styles.timelineContainer}>
        <div className={styles.background}>
          {[...Array(22 - 6)].map((x, y) => {
            const h = DateTime.fromObject({ hour: 6 + y })
            return (
              <div key={y} className={styles.line}>
                <div>
                  <span>{h.toLocaleString({ timeStyle: 'short', hourCycle: 'h24' })}</span>
                </div>
                <hr />
              </div>
            )
          })}
        </div>
        <div className={styles.content}>
          {data?.map((x, y) => (
            <ScheduleBlock key={y} data={x} operationMode={choice} />
          ))}
        </div>
        {DateTime.now().startOf('day').plus({ hours: 6 }) < mockedTime &&
          DateTime.now().startOf('day').plus({ hours: 21 }) > mockedTime && (
            <div className={styles.timePointer}>
              <hr style={{ top: timePointer * 55 + 1 }} />
            </div>
          )}
      </div>
    </>
  )
}
