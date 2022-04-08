import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate } from 'class-validator'
import { DateTime } from 'luxon'

export class ScheduleEntryDto {
  @ApiProperty({
    example: 'Podstawy programowania w Javie',
    description: 'Class name',
  })
  name: string

  @ApiProperty({ example: 'PPJ', description: 'Class short code' })
  code: string

  @ApiProperty({ example: 'Wykład', description: 'Class type (lecture/exercises)' })
  type: string

  @ApiProperty({
    type: [String],
    example: ['WIs I.1 - 1w'],
    description: 'List of groups assigned to the class',
  })
  groups: string[]

  @ApiProperty({
    example: 'A2020',
    description:
      'Name of a building, usually obsolete, because building is already in room name',
  })
  building: string

  @ApiProperty({ example: 'A/358', description: 'Room name' })
  room: string

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: DateTime.fromFormat('07.03.2022 08:30:00', 'dd.MM.yyyy HH:mm:ss').toJSDate(),
    description: 'ISO time of beginning of the class, UTC time',
  })
  begin: Date

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: DateTime.fromFormat('07.03.2022 08:30:00', 'dd.MM.yyyy HH:mm:ss')
      .plus({ hour: 1.5 })
      .toJSDate(),
    description: 'ISO time of end of the class, UTC time',
  })
  end: Date

  @ApiProperty({
    example: ['🥰 Michał Tomaszewski ❤️'],
    description: 'Lecutrer assigned to the class',
    type: [String],
  })
  tutors: string[]
}
