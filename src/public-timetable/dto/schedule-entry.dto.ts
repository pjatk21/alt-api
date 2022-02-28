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
    description: 'Nazwa przedmiotu',
  })
  name: string

  @ApiProperty({ example: 'PPJ', description: 'Kod przedmiotu' })
  code: string

  @ApiProperty({ example: 'Wykład', description: 'Typ zajęć zapisany w planie zajęć' })
  type: string

  @ApiProperty({
    type: [String],
    example: ['WIs I.1 - 1w'],
    description: 'Lista grup biorąca udział w zajęciach',
  })
  groups: string[]

  @ApiProperty({
    example: 'A2020',
    description:
      'Nazwa budynku w którym odbywają się zajęcia, często niepotrzebne, ponieważ jest to już zawarte w numerze sali',
  })
  building: string

  @ApiProperty({ example: 'A/358', description: 'Numer sali' })
  room: string

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: DateTime.fromFormat('07.03.2022 08:30:00', 'dd.MM.yyyy HH:mm:ss').toJSDate(),
    description: 'Czas ISO rozpoczęcia zajęć, przechowywany jako czas UTC',
  })
  begin: Date

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: DateTime.fromFormat('07.03.2022 08:30:00', 'dd.MM.yyyy HH:mm:ss')
      .plus({ hour: 1.5 })
      .toJSDate(),
    description: 'Czas ISO zakończenia zajęć, przechowywany jako czas UTC',
  })
  end: Date

  @ApiProperty({
    nullable: true,
    example: '🥰 Michał Tomaszewski ❤️',
    description: 'Wykładowca/ćwiczeniowiec przypisany do zajęć',
  })
  tutor: string | null

  @ApiProperty({
    type: ScheduleEntryRawComponentsDto,
    description: 'Resztki danych ze scarpu, przydatne przy debugu',
  })
  raw: ScheduleEntryRawComponentsDto
}
