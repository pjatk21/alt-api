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
    nullable: true,
    example: '🥰 Michał Tomaszewski ❤️',
    description: 'Lecutrer assigned to the class',
  })
  tutor: string | null

  @ApiProperty({
    type: ScheduleEntryRawComponentsDto,
    description: 'Shards of data left from scrap, not really useful',
  })
  raw: ScheduleEntryRawComponentsDto
}
