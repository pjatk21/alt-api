import React from 'react'
import { useQuery } from 'react-query'
import { baseUrl } from '../../util'
import ky from 'ky'
import UniversalPicker from './UniversalPicker'
import { ModeChoice } from './ChoicePicker'

type GroupPickerProps = {
  groups: string[]
  setGroups: (value: string[]) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

const getAllGroups = () =>
  ky.get(`${baseUrl}v1/timetable/groups`).json<{ groupsAvailable: string[] }>()

export function ExperimentalGroupPicker({
  groups,
  setGroups,
  visible,
  setVisible,
}: GroupPickerProps) {
  const { data: groupsData } = useQuery('groups', getAllGroups)

  return (
    <UniversalPicker
      values={groups}
      setValues={setGroups}
      visible={visible}
      setVisible={setVisible}
      datalist={groupsData?.groupsAvailable ?? []}
      operationMode={ModeChoice.STUDENT}
    />
  )
}
