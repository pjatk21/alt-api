import { ApiProperty } from '@nestjs/swagger'
import { ScheduleEntry } from 'pja-scrapper'
import { GroupDecodedDto } from './group-decoded.dto'
import { DateTime } from 'luxon'

export class ScheduleEntryDto implements ScheduleEntry {
  @ApiProperty({ required: false, example: 'Podstawy programowania w Javie' })
  name?: string

  @ApiProperty({ required: false, example: 'PPJ' })
  code?: string

  @ApiProperty({ required: false, example: 'wykład' })
  type?: string

  @ApiProperty({ type: [GroupDecodedDto] })
  groups?: GroupDecodedDto[]

  @ApiProperty({ required: false })
  building?: string

  @ApiProperty({ required: false })
  room?: string

  @ApiProperty()
  begin: Date

  @ApiProperty()
  end: Date

  @ApiProperty({ example: DateTime.now().toFormat('yyyy-MM-dd') })
  dateString: string

  @ApiProperty({ required: false, example: '🥰 Michał Tomaszewski ❤️' })
  tutor?: string
}
