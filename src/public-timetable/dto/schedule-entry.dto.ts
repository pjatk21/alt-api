import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { DateTime } from 'luxon'

class ScheduleEntryRawComponentsDto {
  @ApiProperty({ example: 'WIs I.1 - 1w' })
  groups: string

  @ApiProperty({ example: '07.03.2022' })
  date: string

  @ApiProperty({ example: '08:30:00' })
  begin: string

  @ApiProperty({ example: '10:00:00' })
  end: string
}

export class ScheduleEntryDto {
  @ApiProperty({ example: 'Podstawy programowania w Javie' })
  name: string

  @ApiProperty({ example: 'PPJ' })
  code: string

  @ApiProperty({ example: 'wykład' })
  type: string

  @ApiProperty({ type: [String], example: ['WIs I.1 - 1w'] })
  groups: string[]

  @ApiProperty()
  building: string

  @ApiProperty()
  room: string

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: DateTime.now().toJSDate() })
  begin: Date

  @Type(() => Date)
  @IsDate()
  @ApiProperty({ example: DateTime.now().plus({ hour: 1, minutes: 30 }).toJSDate() })
  end: Date

  @ApiProperty({ nullable: true, example: '🥰 Michał Tomaszewski ❤️' })
  tutor: string | null

  @ApiProperty({ type: ScheduleEntryRawComponentsDto })
  raw: ScheduleEntryRawComponentsDto
}
