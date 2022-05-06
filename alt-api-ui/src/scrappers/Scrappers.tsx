import { Button, Card, Grid, Loading, Text, Tooltip } from '@nextui-org/react'
import { DateTime } from 'luxon'
import React, { useState } from 'react'
import ky, { HTTPError } from 'ky'
import { useQuery } from 'react-query'
import { baseUrl } from '../util'
import { ModalStateHistory } from '../dev/ModalStateHistory'

export type ScrapperLike = {
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

function ScrapperStatusCard(props: { scrapper: ScrapperLike }) {
  const [historyVisible, setHistoryVisible] = useState(false)
  const { scrapper } = props
  const color = colorFromState(scrapper.lastState)

  return (
    <Card color={color}>
      <Tooltip content={<Text css={{ fontFamily: '$mono' }}>{scrapper.uuid}</Text>}>
        <Text h4 style={{ fontStyle: 'italic' }}>
          {scrapper.name}
        </Text>
      </Tooltip>

      <Card>
        <Text>
          Stan:{' '}
          <Text span css={{ fontFamily: '$mono' }}>
            {scrapper.lastState}
          </Text>
        </Text>
        <Text>
          Ostatnia aktualizacja stanu: <br />{' '}
          {DateTime.fromISO(scrapper.lastUpdated).toISO()}
        </Text>
        <Button color={color} bordered onClick={() => setHistoryVisible(true)}>Historia statusów</Button>
      </Card>

      <ModalStateHistory
        scrapper={scrapper}
        visible={historyVisible}
        setVisible={setHistoryVisible}
      />
    </Card>
  )
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
    if (data.length === 0) return <p>Nie ma podłączonych scrapperów...</p>

    return (
      <Grid.Container gap={2} wrap={'wrap'}>
        {data.map((scrapper) => (
          <Grid sm={6} key={scrapper.uuid}>
            <ScrapperStatusCard scrapper={scrapper} />
          </Grid>
        ))}
      </Grid.Container>
    )
  } else {
    return <p>Ayo?</p>
  }
}

// export function ScrappersWrapper() {
//   return <Scrappers />
// }
