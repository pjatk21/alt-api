import { Button, Card, Container, Grid, Input, Loading, Spacer, Text } from '@nextui-org/react'
import { plainToInstance } from 'class-transformer'
import ky from 'ky'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { AltapiScheduleEntry } from '../altapi'
import NavLikeBar from '../components/NavLikeBar'
import { TutorDatalist } from '../datalists/TutorDatalist'
import { baseUrl } from '../util'

function getTutorsNextEntries(tutorName: string): Promise<{ entries: AltapiScheduleEntry[] }> {
  const begin = DateTime.now().minus({ minutes: 90 })
  const end = begin.plus({ months: 6 })

  const params = new URLSearchParams()
  params.append('tutors', tutorName)
  params.append('from', begin.toISO())
  params.append('to', end.toISO())

  return ky
    .get(`${baseUrl}v1/timetable/range`, {
      searchParams: params,
    })
    .json<{ entries: unknown[] }>()
    .then((body) => ({
      entries: plainToInstance(AltapiScheduleEntry, body.entries).sort((x1, x2) =>
        x1.begin.diff(x2.begin).as('milliseconds'),
      ),
    }))
}

type TutorBriefEntryProps = {
  entry: AltapiScheduleEntry
}

export function TutorBriefEntry({ entry }: TutorBriefEntryProps) {
  return (
    <Card>
      <Text>
        {entry.begin.toLocaleString({
          timeStyle: 'short',
          dateStyle: 'full',
        })}
      </Text>
      <Text>
        {entry.room} @ {entry.code}
      </Text>
    </Card>
  )
}

export function TutorFinder() {
  const [tutorName, setTutorName] = useState('Smyk Adam')
  const updateTutorName: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    const val = (document.getElementById('tutName') as HTMLInputElement).value
    setTutorName(val)
  }

  const { data: tutorSchedule, isLoading } = useQuery(['tutor-schedule', tutorName], () =>
    getTutorsNextEntries(tutorName),
  )

  return (
    <Container xs>
      <NavLikeBar>
        <Text h2>Poprzedzajce grupy</Text>
      </NavLikeBar>
      <Container>
        <TutorDatalist id={'datalist'} />
        <Input id={'tutName'} disabled={isLoading} initialValue={tutorName} list={'datalist'} />
        <Button onClick={updateTutorName} bordered auto>Wyszukaj</Button>
        <Spacer />
        {isLoading && <Loading />}
        <Grid.Container gap={1}>
          {tutorSchedule &&
            tutorSchedule.entries.slice(0, 30).map((entry) => {
              return (
                <Grid xs={6}>
                  <TutorBriefEntry entry={entry} />
                </Grid>
              )
            })}
        </Grid.Container>
      </Container>
    </Container>
  )
}
