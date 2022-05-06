import React from 'react'
import { Button, Card, Col, Container, Link, Spacer, Text } from '@nextui-org/react'
import { CalendarAdd } from '../calendar/CalendarAdd'
import { Scrappers } from '../scrappers/Scrappers'
import { LastUpdate } from '../dev/LastUpdate'
import { UsefulLinks } from './UsefulLinks'
import { Link as RRDLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

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
              <Text margin={1}>Nowy, lepszy plan zajęć dla PJATK.</Text>
              <RRDLink to="/app">
                <Button
                  iconRight={<FontAwesomeIcon icon={faArrowRight} />}
                  color={'gradient'}
                  auto
                >
                  Sprawdź nową web appkę!
                </Button>
              </RRDLink>
              <Spacer />
              <UsefulLinks />
            </Container>
          </Card.Body>
        </Card>
        <Spacer />
        <Card>
          <Card.Header>
            <Container>
              <Text h2>Skonfiguruj kalendarz</Text>
              <Link
                href="https://github.com/pjatk21/alt-api/wiki/ICS-integration"
                css={{ opacity: 0.5 }}
              >
                Dowiedz się więcej na temat integracji ICS wraz z kalendarzem
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
          Stworzone z ❤️ && ☕️ przez @kpostekk
        </Text>
        <Spacer />
      </Col>
    </Container>
  )
}
