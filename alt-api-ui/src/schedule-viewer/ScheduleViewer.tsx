import React from 'react'
import { Container, Text } from '@nextui-org/react'
import { ScheduleTimeline } from './ScheduleTimeline'

export function ScheduleViewer() {
  return (
    <Container xs>
      <Text h2>Plan zajęć</Text>
      <ScheduleTimeline />
    </Container>
  )
}
