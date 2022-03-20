import React from 'react'
import { Loading, Text } from '@nextui-org/react'
import { useQuery } from 'react-query'
import { DateTime } from 'luxon'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

type LastUpdateLike = {
  lastScrapperUpload: string
  dataUpTo: string
  count: {
    groups: number
    tutors: number
  }
}

const getLastUpdate: () => Promise<LastUpdateLike> = () =>
  fetch(`${baseUrl}lastUpdate`).then((r) => r.json())

export function LastUpdate() {
  const { data, error, isLoading } = useQuery(`${baseUrl}lastUpdate`, getLastUpdate)

  if (error)
    return (
      <Text as={'pre'} color="error">
        {JSON.stringify(error)}
      </Text>
    )
  if (isLoading) return <Loading />

  if (data) {
    return (
      <>
        <Text h3>Last update</Text>
        <Text h5>Last (any) schedule entry update was</Text>
        <Text>
          {DateTime.fromISO(data.lastScrapperUpload)
            .diffNow()
            .negate()
            .shiftTo('days', 'hours', 'minutes')
            .toHuman()} ago ({data.lastScrapperUpload})
        </Text>
        <Text h5>Data provided for next</Text>
        <Text>
          {DateTime.fromISO(data.dataUpTo)
            .diffNow()
            .shiftTo('months', 'days', 'hours')
            .toHuman()} ({data.dataUpTo})
        </Text>
        <Text h5>While scrapping, scrappers found</Text>
        <Text>
          {data.count.groups} groups and {data.count.tutors} tutors
        </Text>
        {/* <Text as={'pre'}>{JSON.stringify(data, undefined, 2)}</Text> */}
      </>
    )
  }
  return <p>ughhhh</p>
}
