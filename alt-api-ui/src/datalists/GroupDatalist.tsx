import ky from 'ky'
import React from 'react'
import { useQuery } from 'react-query'
import { baseUrl } from '../util'

const getAllGroups = () =>
  ky.get(`${baseUrl}v1/timetable/groups`).json<{ groupsAvailable: string[] }>()

export type DatalistProps = {
  id: string
}

export function GroupDatalist({ id }: DatalistProps) {
  const { data } = useQuery('grouos', getAllGroups)

  return (
    <datalist id={id}>
      {(data?.groupsAvailable ?? []).map((group) => (
        <option key={group} value={group} />
      ))}
    </datalist>
  )
}
