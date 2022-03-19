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
  NormalColors,
  Spacer,
  Text,
  Tooltip,
} from '@nextui-org/react'
import useSWR from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple, faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faBook,
  faCircleDollarToSlot,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Preview } from './calendar/Preview'
import { CalendarAdd } from './calendar/CalendarAdd'
import { NotFound } from './NotFound'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

function LastUpdate() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(`${baseUrl}lastUpdate`, fetcher)
  if (error)
    return (
      <Text as={'pre'} color="error">
        {error.toString()}
      </Text>
    )
  if (!data) return <Loading />
  return (
    <>
      <Text h3>Last update</Text>
      <Text as={'pre'}>{JSON.stringify(data, undefined, 2)}</Text>
    </>
  )
}

type UsefulLinkProps = {
  icon?: React.ReactNode
  builtinColor?: NormalColors
  customColor?: string
  tooltip?: string
  disabled?: boolean
  href: string
  text: string
}

function UsefulLink(props: UsefulLinkProps) {
  const { icon, builtinColor, customColor, href, text, tooltip, disabled } = props
  const customColorCss: Record<string, string> | undefined = customColor
    ? {
        color: customColor,
        borderColor: customColor,
      }
    : undefined

  const button = (
    <Button
      icon={icon}
      disabled={disabled}
      bordered
      auto
      color={builtinColor}
      css={customColorCss}
    >
      {text}
    </Button>
  )

  return (
    <Grid>
      <Link href={!disabled ? href : undefined}>
        {tooltip ? <Tooltip content={tooltip}>{button}</Tooltip> : button}
      </Link>
    </Grid>
  )
}

function UsefulLinks() {
  return (
    <>
      <h3>Useful links</h3>
      <Grid.Container
        gap={1}
        alignItems={'center'}
        justify={'flex-start'}
        direction={'row'}
        wrap={'wrap'}
      >
        <UsefulLink
          icon={<FontAwesomeIcon icon={faBook} />}
          builtinColor={'primary'}
          href={baseUrl + 'redoc'}
          text={'ReDoc'}
        />
        <UsefulLink
          icon={<FontAwesomeIcon icon={faGithub} />}
          builtinColor={'secondary'}
          href={'https://github.com/pjatk21/alt-api'}
          text={'Github'}
        />
        <UsefulLink
          icon={<FontAwesomeIcon icon={faWarning} />}
          builtinColor={'warning'}
          href={'https://github.com/pjatk21/alt-api/issues/new/choose'}
          text={'Report issue'}
        />
        <UsefulLink
          icon={<FontAwesomeIcon icon={faApple} />}
          customColor={'#cfd4d4'}
          href={'https://github.com/pjatk21/Pie-Schedule'}
          disabled
          text={'iOS app (𝝰)'}
          tooltip={'I need money for Apple licences'}
        />
        <UsefulLink
          icon={<FontAwesomeIcon icon={faCircleDollarToSlot} />}
          customColor={'#e0a8dd'}
          href={'https://revolut.me/kpostekk'}
          text={'Donate me'}
          tooltip={"coffee && booze ain't cheap ☕️ 🥃"}
        />
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
          <Spacer />
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
                  Query PJA schedule in milliseconds. A great alternative to original
                  webpage from 2010.
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
                <Text
                  h2
                  css={{
                    textGradient: 'to bottom left, #3EE5FF 0%, #FF38F2 100%',
                  }}
                >
                  Subscribe to ICS
                </Text>
                <Link
                  href="https://github.com/pjatk21/alt-api/wiki/ICS-integration"
                  css={{ opacity: 0.5 }}
                >
                  Read more about ICS integration here
                </Link>
              </Container>
            </Card.Header>
            <Card.Body>
              <Container>
                <CalendarAdd />
              </Container>
            </Card.Body>
          </Card>
          <Spacer />
          <Text style={{ textAlign: 'center', opacity: 0.4 }}>
            Created with ❤️ && ☕️ by @kpostekk
          </Text>
          <Spacer />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
