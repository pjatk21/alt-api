import { ApiProperty } from "@nestjs/swagger";
import { ScheduleEntry } from "pja-scrapper";
import { GroupDecoded } from "pja-scrapper/dist/types";
import { GroupDecodedDto } from "./group-decoded.dto";
import { DateTime } from 'luxon'

export class ScheduleEntryDto implements ScheduleEntry {
  @ApiProperty({ nullable: true, example: 'Podstawy programowania w Javie' })
  name?: string

  @ApiProperty({ nullable: true, example: 'PPJ' })
  code?: string

  @ApiProperty({ nullable: true, example: 'wykład' })
  type?: string

  @ApiProperty({ type: [GroupDecodedDto] })
  groups?: GroupDecodedDto[]

  @ApiProperty({ nullable: true })
  building?: string

  @ApiProperty({ nullable: true })
  room?: string

  @ApiProperty()
  begin: Date

  @ApiProperty()
  end: Date

  @ApiProperty({ example: DateTime.now().toFormat('yyyy-MM-dd') })
  dateString: string

  @ApiProperty({ nullable: true, example: '🥰 Michał Tomaszewski ❤️' })
  tutor?: string
}
