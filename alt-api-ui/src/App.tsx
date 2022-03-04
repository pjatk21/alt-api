import React from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  createTheme,
  Grid,
  Link,
  Loading,
  NextUIProvider,
  Spacer,
  Text,
} from '@nextui-org/react'
import useSWR from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faBook, faWarning } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Preview } from './Preview'
import { CalendarAdd } from './CalendarAdd'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000'
  : 'https://altapi.kpostek.dev'

function LastUpdate() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(`${baseUrl}/lastUpdate`, fetcher)
  if (error) return null
  if (!data) return <Loading />
  return (
    <>
      <Text h3>Last update</Text>
      <Text as={'pre'}>
        {JSON.stringify(data, undefined, 2)}
      </Text>
    </>
  )
}

function UsefulLinks() {
  return (<>
    <h3>Useful links</h3>
      <Grid.Container
      gap={2}
      alignItems={'center'}
      justify={'flex-start'}
      direction={'row'}
      wrap={'wrap'}
    >
      <Grid>
        <Link href="/redoc">
          <Button
            icon={<FontAwesomeIcon icon={faBook} />}
            bordered
            ghost
            auto
          >
            ReDoc
          </Button>
        </Link>
      </Grid>
      <Grid>
        <Link href="https://github.com/pjatk21/alt-api">
          <Button
            icon={<FontAwesomeIcon icon={faGithub} />}
            bordered
            ghost
            auto
            color={'secondary'}
          >
            Github
          </Button>
        </Link>
      </Grid>
      <Grid>
        <Link href="mailto:krystian@postek.eu?subject=Nadu%C5%BCycia%20Altapi">
          <Button
            icon={<FontAwesomeIcon icon={faWarning} />}
            bordered
            ghost
            auto
            color="warning"
          >
            Abuse
          </Button>
        </Link>
      </Grid>
    </Grid.Container>
  </>
  )
}

function AppHome() {
  const darkTheme = createTheme({
    type: 'dark',
  })

  return (
    <NextUIProvider theme={darkTheme}>
      <Container sm>
        <Col>
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
                <Text margin={1}>
                  Query PJA schedule in milliseconds. A great alternative to original webpage from 2010.
                </Text>
                <LastUpdate />
                <UsefulLinks />
              </Container>
            </Card.Body>
          </Card>
          <Spacer />
          <Card>
            <Card.Header>
              <Container>
                <Text h2>Subscribe to ICS</Text>
              </Container>
            </Card.Header>
            <Card.Body>
              <Container>
                <CalendarAdd />
              </Container>
            </Card.Body>
          </Card>
          <Spacer y={3} />
        </Col>
      </Container>
    </NextUIProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppHome />} />
        <Route path="preview/" element={<Preview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
