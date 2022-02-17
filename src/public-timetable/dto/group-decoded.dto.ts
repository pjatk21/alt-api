import { ApiProperty } from "@nestjs/swagger";
import { GroupDecoded, PJALevel, PJALocations, PJAMasterSubjects, PJAStudyMode } from "pja-scrapper/dist/types";

export class GroupDecodedDto implements GroupDecoded {
  @ApiProperty({ enum: PJALocations, example: PJALocations.WARSAW })
  location: PJALocations

  @ApiProperty({ enum: PJAMasterSubjects, example: PJAMasterSubjects.IT })
  mainSubject: PJAMasterSubjects

  @ApiProperty({ enum: PJAStudyMode, example: PJAStudyMode.SATIONARY })
  studyMode: PJAStudyMode

  @ApiProperty({ nullable: true, enum: PJALevel, example: PJALevel.FIRST })
  level?: PJALevel

  @ApiProperty({ nullable: true, example: 1 })
  semester?: number

  @ApiProperty({ nullable: true, default: false })
  itn?: boolean

  @ApiProperty({ nullable: true })
  specialization?: string

  @ApiProperty({ nullable: true, example: 1 })
  groupNumber?: number

  @ApiProperty({ nullable: true, example: 'w' })
  groupLetter?: string

  @ApiProperty({ example: 'WIs I.1 - 1w' })
  raw: string
}
