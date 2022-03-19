import {
  Card,
  Col,
  Container,
  createTheme,
  Link,
  NextUIProvider,
  Spacer,
  Text,
} from '@nextui-org/react'
import React from 'react'
import { CalendarAdd } from '../calendar/CalendarAdd'
import { LastUpdate } from './LastUpdate'
import { UsefulLinks } from './UsefulLinks'

export function AppHome() {
  return (
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
  )
}
