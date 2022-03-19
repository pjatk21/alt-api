import { Loading } from '@nextui-org/react'
import React from 'react'
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from 'react-query'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

type ScrapperLike = {
  uuid: string
  name: string
  lastState: string
  lastStatus: string
}

const getScrappers: () => Promise<ScrapperLike[]> = () =>
  fetch(`${baseUrl}hypervisor/scrappers`).then((r) => r.json())

export function Scrappers() {
  const { data, error, isLoading, isError } = useQuery('scrappers', getScrappers)

  if (isLoading) return <Loading />
  if (isError) return <pre>{JSON.stringify(error)}</pre>

  if (data) {
    return (
      <>
        {data.map((scrapper) => (
          <p key={scrapper.uuid}>{JSON.stringify(scrapper)}</p>
        ))}
      </>
    )
  } else {
    return <p>Ayo?</p>
  }
}

export function ScrappersWrapper() {
  return <Scrappers />
}
