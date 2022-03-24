import { Card, Container, Text } from '@nextui-org/react'
import React from 'react'
import { LastUpdate } from './LastUpdate'
import { Scrappers } from '../scrappers/Scrappers'

export function DevPage() {
  return (
    <Container md>
      <Card>
        <Card.Body>
          <Text h3>Data up-to-date&apos;ness</Text>
          <LastUpdate />
          <Text h3>Connected scrappers</Text>
          <Scrappers />
        </Card.Body>
      </Card>
    </Container>
  )
}
