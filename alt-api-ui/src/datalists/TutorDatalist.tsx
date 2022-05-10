import ky from 'ky'
import { useQuery } from 'react-query'
import { baseUrl } from '../util'

const getAllTutors = () =>
  ky.get(`${baseUrl}v1/timetable/tutors`).json<{ tutorsAvailable: string[] }>()

export type DatalistProps = {
  id: string
}

export function TutorDatalist({ id }: DatalistProps) {
  const { data } = useQuery('tutors', getAllTutors)

  return (
    <datalist id={id}>
      {(data?.tutorsAvailable ?? []).map((tutor) => (
        <option key={tutor} value={tutor} />
      ))}
    </datalist>
  )
}
