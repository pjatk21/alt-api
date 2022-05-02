import { Loading, Text } from '@nextui-org/react'
import { useQuery } from 'react-query'
import { DateTime } from 'luxon'
import ky from 'ky'
import { baseUrl } from '../util'

type LastUpdateLike = {
  lastScrapperUpload: string
  dataUpTo: string
  count: {
    groups: number
    tutors: number
  }
}

const getLastUpdate: () => Promise<LastUpdateLike> = () => ky.get(`${baseUrl}lastUpdate`).json()

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
        <Text h5>Ostatnia, dowolna, cząstkowa aktualizacja danych była</Text>
        <Text>
          {DateTime.fromISO(data.lastScrapperUpload)
            .diffNow()
            .negate()
            .shiftTo('days', 'hours', 'minutes')
            .toHuman()}{' '}
          temu ({data.lastScrapperUpload})
        </Text>
        <Text h5>Pobrane dane na następne</Text>
        <Text>
          {DateTime.fromISO(data.dataUpTo)
            .diffNow()
            .shiftTo('months', 'days', 'hours')
            .toHuman()}{' '}
          ({data.dataUpTo})
        </Text>
        <Text h5>Posiadane dane dla</Text>
        <Text>
          {data.count.groups} grup i {data.count.tutors} wykładowców/ćwiczeniowców
        </Text>
      </>
    )
  }
  return <p>ughhhh</p>
}
