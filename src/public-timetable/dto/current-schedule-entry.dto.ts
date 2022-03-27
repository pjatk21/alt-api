import { ApiProperty } from '@nestjs/swagger'
import { ScheduleEntryDto } from './schedule-entry.dto'

export class CurrentScheduleEntryResponseDto {
  @ApiProperty()
  currentEntry: ScheduleEntryDto | null
}
