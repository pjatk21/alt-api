import { useState } from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  createTheme,
  Grid,
  Input,
  Link,
  Loading,
  NextUIProvider,
  Row,
  Text,
} from '@nextui-org/react'
import useSWR from 'swr'
import { DateTime } from 'luxon'

function TryMeStudentEdition({ group, date }: { group: string; date: string }) {
  if (!date.match(/^\d{4}-\d{2}-\d{2}$/) || !group.match(/\d+\w/)) return <Loading />

  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(`/public/timetable/date/${date}?groups=${group}`, fetcher)
  if (error) return <Text>failed to load</Text>
  if (!data) return <Loading />
  if (data.entries.length === 0) return <Text i>brak zajęć w bazie na ten dzień</Text>

  return <ol>
    {data.entries.map((e: any) => (
    <li key={e.begin + e.code + e.raw.groups}>
      {DateTime.fromISO(e.begin).toFormat('HH:mm')} - {e.code}@{e.room}
    </li>
  ))}
  </ol>
}

function TryMeTutorEdition({ tutor, date }: { tutor: string; date: string }) {
  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) return <Loading />

  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(`/public/timetable/date/${date}?tutors=${tutor}`, fetcher)
  if (error) return <Text>failed to load</Text>
  if (!data) return <Loading />
  if (data.entries.length === 0) return <Text i>brak zajęć w bazie na ten dzień</Text>

  return <ol>
    {data.entries.map((e: any) => (
    <li key={e.begin + e.code + e.raw.groups}>
      {DateTime.fromISO(e.begin).toFormat('HH:mm')} - {e.code}@{e.room}
    </li>
  ))}
  </ol>
}


function LastUpdate() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(`/lastUpdate`, fetcher)
  if (error) return null
  if (!data) return <Loading />
  return <Text>Ostatnia aktualizacja:<br/>{data.lastUpdate}</Text>
}

function App() {
  const [testGroup, setTestGroup] = useState('WIs I.2 - 46c')
  const [testDate, setTestDate] = useState(DateTime.local().toFormat('yyyy-MM-dd'))
  const [testTutor, setTestTutor] = useState("")
  const darkTheme = createTheme({
    type: 'dark',
  })

  return (
    <NextUIProvider theme={darkTheme}>
      <Container>
        <Grid.Container justify="center" alignContent="center" gap={4} wrap={'wrap'}>
          <Grid sm={3}>
            <Card>
              <Card.Header>
                <Container>
                  <Text
                    h1
                    css={{
                      textGradient: '45deg, #4be385 -20%, #5dbaf0 50%',
                    }}
                  >
                    Altapi
                  </Text>
                  <Text i>alta paɪ</Text>
                </Container>
              </Card.Header>
              <Card.Body>
                <Container>
                  <LastUpdate />
                </Container>
                <Grid.Container gap={3} alignItems={'center'} direction={'row'} wrap={'wrap'}>
                  <Grid>
                    <Link href="/redoc">Docs</Link>
                  </Grid>
                  <Grid>
                    <Link href="https://github.com/pjatk21/alt-api">Github</Link>
                  </Grid>
                  <Grid>
                    <Link href="mailto:krystian@postek.eu?subject=Nadu%C5%BCycia%20Altapi">
                      Report abuse
                    </Link>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </Grid>
          <Grid sm={6}>
            <Card>
              <Card.Header>
                <Container>
                  <h2>Try me!</h2>
                </Container>
              </Card.Header>
              <Card.Body>
                <Container>
                  <p>
                    Zajęcia dla grupy
                    <Input
                      value={testGroup}
                      underlined
                      onChange={({ target }) => setTestGroup(target.value)}
                    />
                    w dniu
                    <Input
                      value={testDate}
                      underlined
                      onChange={({ target }) => setTestDate(target.value)}
                    />
                  </p>
                  <ol>
                    <TryMeStudentEdition group={testGroup} date={testDate} />
                  </ol>
                </Container>
                <Container>
                <p>
                    Zajęcia dla ćwiczeniowca/wykładowcy
                    <Input
                      value={testTutor}
                      underlined
                      onChange={({ target }) => setTestTutor(target.value)}
                    />
                    w dniu
                    <Input
                      value={testDate}
                      underlined
                      onChange={({ target }) => setTestDate(target.value)}
                    />
                  </p>
                  <TryMeTutorEdition tutor={testTutor} date={testDate} />
                </Container>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </Container>
    </NextUIProvider>
  )
}

export default App
