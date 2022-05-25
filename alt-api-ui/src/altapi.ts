import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'
import { useReadLocalStorage } from 'usehooks-ts'
import { ModeChoice } from './schedule-viewer/pickers/ChoicePicker'
import { AltapiQueryOptions } from './schedule-viewer/ScheduleViewer'

export function useIsConfigured() {
  const choice = useReadLocalStorage<ModeChoice>('choice')
  const queryOptions = useReadLocalStorage<AltapiQueryOptions>('queryOptions')
  return !!choice && !!queryOptions
}

export class AltapiScheduleEntry {
  name: string
  code: string
  type: string
  room: string
  groups: string[]
  tutors: string[]
  building: string

  @Type(() => DateTime)
  @Transform(({ value }) => DateTime.fromISO(value))
  begin: DateTime

  @Type(() => DateTime)
  @Transform(({ value }) => DateTime.fromISO(value))
  end: DateTime

  get isActive(): boolean {
    const now = DateTime.now()
    return this.begin <= now && now < this.end
  }
}
