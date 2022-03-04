import React from "react";
import { Container, createTheme, Loading, NextUIProvider, Text } from "@nextui-org/react";
import useSWR from "swr";
import { DateTime } from "luxon";
// import { URLSearchParams } from "url";

const baseUrl = import.meta.env.DEV
? 'http://krystians-mac-pro.local:4000'
: 'https://altapi.kpostek.dev'

function PreviewWidget() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const browserParams = new URLSearchParams(window.location.search)
  const url = new URL(baseUrl)
  url.pathname = '/v1/timetable/single'
  url.searchParams.append('group', browserParams.get('group') ?? '')
  url.searchParams.append('at', browserParams.get('at') ?? '')

  const { data, error } = useSWR(url.toString(), fetcher)

  
  if (error) return <Text>{error.message}</Text>
  if (!data) return <Loading />

  const begin = DateTime.fromISO(data.begin).setZone()
  const end = DateTime.fromISO(data.end).setZone()

  return <>
    <Text h2>{data.name}</Text>
    <Text>W dniu: {begin.toFormat('EEEE, d MMMM')}</Text>
    <Text>W godzinach: {begin.toFormat('HH:mm')} - {end.toFormat('HH:mm')}</Text>
    {data.tutor && <Text>Prodwadzi {data.tutor}</Text>}
    <Text>Sala {data.room} w budynku {data.building}</Text>
  </>
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
