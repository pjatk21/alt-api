import { Transform, Type } from 'class-transformer'
import { DateTime } from 'luxon'

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
}
