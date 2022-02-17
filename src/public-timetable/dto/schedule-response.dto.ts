import { ApiProperty } from "@nestjs/swagger";
import { GroupDecodedDto } from "./group-decoded.dto";
import { ScheduleEntryDto } from "./schedule-entry.dto";

export class ScheduleResponseDto {
  @ApiProperty({ type: GroupDecodedDto, nullable: true })
  group?: GroupDecodedDto

  @ApiProperty({ type: [ScheduleEntryDto] })
  entries: ScheduleEntryDto[]
}
