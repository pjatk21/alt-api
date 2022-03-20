import React from 'react'
import {
  Card,
  Container,
  createTheme,
  Loading,
  NextUIProvider,
  Spacer,
  Text,
} from '@nextui-org/react'
import { DateTime } from 'luxon'
import { buildings } from './buildings.json'
import { ScheduleEntryRawResponse } from '../types'
import { useQuery } from 'react-query'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

function PreviewWidget() {
  // const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const browserParams = new URLSearchParams(window.location.search)
  const url = new URL(baseUrl)
  url.pathname = '/v1/timetable/single'
  url.searchParams.append('group', browserParams.get('group') ?? '')
  url.searchParams.append('at', browserParams.get('at') ?? '')
  const getPreview: () => Promise<ScheduleEntryRawResponse> = () => fetch(url.toString()).then((r) => r.json())

  const { data, isError, isLoading } = useQuery('preview', getPreview)
  if (isError) return <Text>{isError}</Text>
  if (isLoading || !data) return <Loading />

  const begin = DateTime.fromISO(data.begin).setZone()
  const end = DateTime.fromISO(data.end).setZone()

  const buildingLocation: string | undefined = buildings.filter(
    (building) => building.name === data.building,
  )[0]?.where

  return (
    <>
      <Spacer />
      <Card>
        <Container>
          <Text h2>{data.name}</Text>
          <Text h3>{data.type}</Text>
          <Text>W dniu: {begin.toFormat('EEEE, d MMMM')}</Text>
          <Text>
            W godzinach: {begin.toFormat('HH:mm')} - {end.toFormat('HH:mm')}
          </Text>
          {data.tutor && <Text>Prodwadzi {data.tutor}</Text>}
          <Text>
            Sala {data.room} w budynku {data.building}
          </Text>
          <Text>Uczestniczące grupy na zajęciach</Text>
          <ul>
            {data.groups.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </Container>
      </Card>
      <Spacer />
    </>
  )
}

export function Preview() {
  const darkTheme = createTheme({
    type: 'dark',
  })

  return (
    <NextUIProvider theme={darkTheme}>
      <Container sm>
        <PreviewWidget />
      </Container>
    </NextUIProvider>
  )
}