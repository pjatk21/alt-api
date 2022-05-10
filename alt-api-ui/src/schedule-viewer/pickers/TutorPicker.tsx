import ky from 'ky'
import React from 'react'
import { useQuery } from 'react-query'
import { baseUrl } from '../../util'
import { ModeChoice } from './ChoicePicker'
import UniversalPicker from './UniversalPicker'

type TutorPickerProps = {
  tutors: string[]
  setTutors: (value: string[]) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

const getAllTutors = () =>
  ky.get(`${baseUrl}v1/timetable/tutors`).json<{ tutorsAvailable: string[] }>()

export function ExperimentalTutorPicker({
  tutors,
  setTutors,
  visible,
  setVisible,
}: TutorPickerProps) {
  const { data: tutorsData } = useQuery('tutors', getAllTutors)

  return (
    <UniversalPicker
      values={tutors}
      setValues={setTutors}
      visible={visible}
      setVisible={setVisible}
      datalist={tutorsData?.tutorsAvailable ?? []}
      operationMode={ModeChoice.TUTOR}
    />
  )
}
