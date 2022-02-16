import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { group } from 'console'
import { ScheduleEntry } from 'pja-scrapper'
import { GroupCoder } from 'pja-scrapper/dist/groupCoder'
import { PublicTimetableService } from './public-timetable.service'
import { Timetable, TimetableDocument, TimetableSchema } from './schemas/timetable.schema'

@ApiTags('Timetables')
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

  @Post('/upload/:date')
  async upload(@Body() entry: ScheduleEntry[], @Param('date') date: string) {
    return await this.timetableService.sink(entry, date)
  }

  @Get('/group/:group/:date')
  async byGroup(@Param('group') groupRaw: string, @Param('date') date: string) {
    const entries = await this.timetableService.timetableForGroup(date, groupRaw)

    return {
      group,
      entries: entries.map((e) => e.entry),
    }
  }
}
