import { Card, Grid, Loading, Text } from '@nextui-org/react'
import React from 'react'
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from 'react-query'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

type ScrapperLike = {
  uuid: string
  name: string
  lastState: string
  lastUpdated: string
}

const getScrappers: () => Promise<ScrapperLike[]> = () => {
  console.log('aaaaa')
  return fetch(`${baseUrl}hypervisor/scrappers`).then((r) => r.json())
}

function colorFromState(state: string) {
  switch (state) {
    case 'awaiting':
      return 'success'
    case 'work':
      return 'primary'
    case 'ready':
      return 'secondary'
    default:
      return undefined
  }
}

export function Scrappers() {
  const { data, error, isLoading, isError } = useQuery('scrappers', getScrappers, {
    refetchInterval: 1_000,
  })

  if (isLoading) return <Loading />
  if (isError) return <pre>{JSON.stringify(error)}</pre>

  if (data) {
    if (data.length === 0) return <p>There are not any connected scrappers...</p>

    return (
      <Grid.Container gap={2} wrap={'wrap'}>
        {data.map((scrapper) => (
          <Grid sm={6} key={scrapper.uuid}>
            <Card color={colorFromState(scrapper.lastState)}>
              <Text h4>{scrapper.name}</Text>
              <Text css={{ fontFamily: '$mono' }}>{scrapper.uuid}</Text>
              <Card>
                <Text>State: {scrapper.lastState}</Text>
                <Text>Last state update: {scrapper.lastUpdated}</Text>
              </Card>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    )
  } else {
    return <p>Ayo?</p>
  }
}

export function ScrappersWrapper() {
  return <Scrappers />
}
