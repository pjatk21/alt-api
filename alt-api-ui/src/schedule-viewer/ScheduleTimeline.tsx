import { Loading, Spacer, Text, Card, Code, Link } from '@nextui-org/react'
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
import { CountdownTimer } from './CountdownTimer'

type ScheduleTimelineProps = {
  date: DateTime
  queryData: string[]
  choice: ModeChoice
}

function timepointerOffset(begin: number) {
  return DateTime.now()
    .diff(DateTime.now().startOf('day').set({ hour: begin }))
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

function describeDayWithoutAnyHopeForABetterFuture(entries: AltapiScheduleEntry[]) {
  if (entries.length === 0) return 'Nie ma zaplanowanych zajęć na ten dzień...\nMożesz usiąść do komputera i udawać że zrobisz dziś coś produktywnego - ale powiedzmy sobie szczerze, i tak za dużo Ci się pewnie nie uda...'
  const begin = entries[0].begin
  const end = entries.slice(-1)[0].end
  const duration = end.diff(begin).shiftTo('hours')

  return `O, wspaniale - w tym irytującym dniu masz już zaplanowane jakieś zajęcia...\nNa ten dzień ̶j̶e̶s̶t̶e̶ś̶ ̶s̶k̶a̶z̶a̶n̶y̶ ̶n̶a̶  zaplanowano ${
    entries.length
  } p̶r̶a̶c̶e̶ ̶p̶r̶z̶y̶m̶u̶s̶o̶w̶e̶  zajęcia, w godzinach ${begin.toLocaleString({
    timeStyle: 'short',
  })} - ${end.toLocaleString({
    timeStyle: 'short',
  })} trwające łącznie ${duration.toHuman()}\nCo za wspaniały czas by ̶c̶i̶e̶r̶p̶i̶e̶ć̶  cieszyć się życiem!`
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

function useTimePointer(begin: number) {
  const [timePointer, setTimePoiner] = useState(timepointerOffset(begin))
  useInterval(() => setTimePoiner(timepointerOffset(begin)), 1000)
  return timePointer
}

export function ScheduleTimeline({ date, queryData, choice }: ScheduleTimelineProps) {
  const { hour, minute, second } = DateTime.now().toObject()
  const mockedTime = DateTime.fromObject({ ...date.toObject(), hour, minute, second })

  const settings = useReadLocalStorage<SettingsOptions>('settings')

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

  const displayRanges = {
    begin: Math.min(...(data ?? []).map((x) => x.begin.hour)),
    end: Math.max(...(data ?? []).map((x) => x.end.hour)) + 2,
  }

  const timePointer = useTimePointer(displayRanges.begin)

  if (error)
    return (
      <Card color={'error'}>
        {'🧰'} {error.name} - {error.message}
        <Link
          href={
            'https://github.com/pjatk21/alt-api/issues/new?assignees=kpostekk&labels=bug&template=-pl--zg-oszenie-b--du.md&title='
          }
        >
          Zgłoś błąd
        </Link>
      </Card>
    )

  if (isLoading || !data)
    return (
      <Card>
        <Loading color={'primary'} textColor={'primary'}>
          Pobieranie planu zajęć
        </Loading>
      </Card>
    )

  if (data.length === 0) {
    return <Card>Brak zajęć tego dnia</Card>
  }

  return (
    <>
      {data && (
        <>
          <Text blockquote>
            {settings?.olaMode ? describeDayPositively(data) : (settings?.cyprianMode ? describeDayWithoutAnyHopeForABetterFuture(data) : describeDay(data))}
          </Text>
          {data.find((x) => x.isActive) && (
            <>
              <Spacer />
              <CountdownTimer currentScheduledLessons={data} />
            </>
          )}
        </>
      )}
      <Spacer />
      <div className={styles.timelineContainer}>
        <div className={styles.background}>
          {[...Array(displayRanges.end - displayRanges.begin)].map((x, y) => {
            const h = DateTime.fromObject({ hour: displayRanges.begin + y })
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
            <ScheduleBlock
              key={y}
              data={x}
              operationMode={choice}
              displayRanges={displayRanges}
            />
          ))}
        </div>
        {DateTime.now().startOf('day').plus({ hours: displayRanges.begin }) < mockedTime &&
          DateTime.now().startOf('day').plus({ hours: displayRanges.end }) > mockedTime && (
            <div className={styles.timePointer}>
              <hr style={{ top: timePointer * 55 + 1 }} />
            </div>
          )}
      </div>
    </>
  )
}
