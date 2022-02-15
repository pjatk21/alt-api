import { Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import type { ScheduleEntry } from 'pja-scrapper/dist/interfaces'
import { PublicTimetableService } from './public-timetable.service'
import { TimetableDocument } from './schemas/timetable.schema'

@ApiTags('Timetables', 'Public')
@Controller('/public/timetable')
export class PublicTimetableController {
  constructor(private timetableService: PublicTimetableService) {}

  @Get('/mocks')
  @ApiQuery({ name: 'amount', required: false })
  async mock(@Query('amount') amount = 1): Promise<string[]> {
    const timetables: TimetableDocument[] = []

    for (let i = 0; i < amount; i++) {
      const timetable = await this.timetableService.createMock()
      timetables.push(timetable)
    }

    return timetables.map((t) => t.id)
  }
}
