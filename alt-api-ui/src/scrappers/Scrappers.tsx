import { Card, Grid, Loading, Text, Tooltip } from '@nextui-org/react'
import { DateTime } from 'luxon'
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

const getScrappers: () => Promise<ScrapperLike[]> = () =>
  fetch(`${baseUrl}hypervisor/scrappers`).then((r) => r.json())

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
              <Tooltip
                content={<Text css={{ fontFamily: '$mono' }}>{scrapper.uuid}</Text>}
              >
                <Text h4 style={{ fontStyle: 'italic' }}>
                  {scrapper.name}
                </Text>
              </Tooltip>

              <Card>
                <Text>
                  State:{' '}
                  <Text span css={{ fontFamily: '$mono' }}>
                    {scrapper.lastState}
                  </Text>
                </Text>
                <Text>
                  Last state update: <br />{' '}
                  {DateTime.fromISO(scrapper.lastUpdated).toISO()}
                </Text>
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
