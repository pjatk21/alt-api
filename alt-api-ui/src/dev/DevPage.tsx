import { Card, Container, Text } from '@nextui-org/react'
import React from 'react'
import { LastUpdate } from './LastUpdate'
import { Scrappers } from '../scrappers/Scrappers'

export function DevPage() {
  return (
    <Container md>
      <Card>
        <Card.Body>
          <Text h3>Aktualność danych</Text>
          <LastUpdate />
          <Text h3>Połączone scrappery</Text>
          <Scrappers />
        </Card.Body>
      </Card>
    </Container>
  )
}
