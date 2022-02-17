import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ScheduleEntry } from 'pja-scrapper'
import { GroupCoder } from 'pja-scrapper/dist/groupCoder'
import { ScheduleEntryDto } from './dto/schedule-entry.dto'
import { ScheduleResponseDto } from './dto/schedule-response.dto'
import { PublicTimetableService } from './public-timetable.service'
import { TimetableDocument } from './schemas/timetable.schema'

@ApiTags('Timetables')
@Controller('/public/timetable')
export class PublicTimetableController {
  constructor(private timetableService: PublicTimetableService) {}

  /* @Get('/mocks')
  @ApiQuery({ name: 'amount', required: false })
  async mock(@Query('amount') amount = 1): Promise<string[]> {
    const timetables: TimetableDocument[] = []

    for (let i = 0; i < amount; i++) {
      const timetable = await this.timetableService.createMock()
      timetables.push(timetable)
    }

    return timetables.map((t) => t.id)
  } */

  @Get('/:date')
  @ApiResponse({ type: ScheduleResponseDto })
  async byDate(@Param('date') date: string) {
    const entries = await this.timetableService.timetableForDay(date)

    return {
      entries: entries.map((e) => e.entry),
    }
  }

  @Get('/group/:group/:date')
  @ApiParam({ name: 'date', example: '2022-01-21' })
  @ApiParam({ name: 'group', example: 'WIs I.1 - 40c' })
  @ApiResponse({ type: ScheduleResponseDto })
  async byGroup(@Param('group') groupRaw: string, @Param('date') date: string) {
    const entries = await this.timetableService.timetableForGroup(date, groupRaw)

    return {
      group: new GroupCoder().decode(groupRaw),
      entries: entries.map((e) => e.entry),
    }
  }

  @Post('/upload/:date')
  @ApiBody({ type: [ScheduleEntryDto] })
  async upload(@Body() entry: ScheduleEntryDto[], @Param('date') date: string) {
    return await this.timetableService.sink(entry, date)
  }
}
