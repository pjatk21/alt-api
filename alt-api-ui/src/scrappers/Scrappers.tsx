import { Card, Grid, Loading, Text, Tooltip } from '@nextui-org/react'
import { DateTime } from 'luxon'
import React from 'react'
import ky, { HTTPError } from 'ky'
import { useQuery } from 'react-query'
import { baseUrl } from '../util'

type ScrapperLike = {
  uuid: string
  name: string
  lastState: string
  lastUpdated: string
}

const getScrappers: () => Promise<ScrapperLike[]> = () =>
  ky.get(`${baseUrl}hypervisor/scrappers`).json()

function colorFromState(state: string) {
  switch (state) {
    case 'awaiting':
      return 'success'
    case 'work':
      return 'primary'
    case 'ready':
      return 'secondary'
    default:
      return 'warning'
  }
}

export function Scrappers() {
  const { data, error, isLoading, isError } = useQuery('scrappers', getScrappers, {
    refetchInterval: 5_000,
    retry: false,
  })

  if (isLoading) return <Loading />
  if (isError) {
    if (error instanceof HTTPError) return <pre>{error.message}</pre>
  }

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
