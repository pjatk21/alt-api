import React from "react"
import { Loading, Text } from '@nextui-org/react'
import useSWR from "swr"

const baseUrl = import.meta.env.DEV
  ? 'http://krystians-mac-pro.local:4000/'
  : window.location.href

export function LastUpdate() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(`${baseUrl}lastUpdate`, fetcher)
  if (error)
    return (
      <Text as={'pre'} color="error">
        {error.toString()}
      </Text>
    )
  if (!data) return <Loading />
  return (
    <>
      <Text h3>Last update</Text>
      <Text as={'pre'}>{JSON.stringify(data, undefined, 2)}</Text>
    </>
  )
}
