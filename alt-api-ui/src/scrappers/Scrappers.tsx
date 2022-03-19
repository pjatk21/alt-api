import { Loading } from '@nextui-org/react'
import React from 'react'
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from 'react-query'

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

const queryClient = new QueryClient()
const getScrappers = () => fetch(`${baseUrl}hypervisor/scrappers`).then((r) => r.json())

export function Scrappers() {
  const queryClient = useQueryClient()

  const { data, error, isLoading, isError } = useQuery('scrappers', getScrappers)

  if (isLoading) return <Loading />
  if (isError) return <p>Error</p>

  return (
    <>
      {data.map((scrapper) => (
        <p key={scrapper.uuid}>{JSON.stringify(scrapper)}</p>
      ))}
    </>
  )
}

export function ScrappersWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <Scrappers />
    </QueryClientProvider>
  )
}
