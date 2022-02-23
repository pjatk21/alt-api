import { Body, Controller, Get, Headers, Param, Post, Query, UnauthorizedException } from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ScheduleEntryDto } from './dto/schedule-entry.dto'
import { ScheduleResponseDto } from './dto/schedule-response.dto'
import { PublicTimetableService } from './public-timetable.service'

class UploadResponseMock {
  @ApiProperty({ enum: ['replaced', 'added'] })
  result: string
}

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
  @ApiOperation({
    summary: 'Download schedule for a date',
    description:
      'You can pass groups as a query param, if none passed, all entries are returned.',
  })
  @ApiParam({ name: 'date', example: '2022-03-07' })
  @ApiQuery({
    name: 'groups',
    type: [String],
    required: false,
    example: ['WIs I.2 - 46c', 'WIs I.2 - 40c'],
  })
  @ApiOkResponse({ type: ScheduleResponseDto })
  @ApiTooManyRequestsResponse({ description: 'Throttled' })
  async byDate(@Param('date') date: string, @Query('groups') groups?: string[] | string) {
    const safeGroups = typeof groups === 'string' ? [groups] : groups

    const entries = await this.timetableService.timetableForDay(date, safeGroups)

    return {
      entries: entries.map((e) => e.entry),
    }
  }

  @Post('/upload/:date')
  @ApiOperation({
    summary: 'Upload a schedule for a selected date',
    description:
      "Endpoint dedicated for scrappers to provide new data. Regular users won't use that.",
  })
  @ApiBody({ type: [ScheduleEntryDto] })
  @ApiHeader({ name: 'X-Upload-key' })
  @ApiCreatedResponse({
    description: 'Created/updated schedule',
    type: UploadResponseMock,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid X-Upload-key' })
  @ApiTooManyRequestsResponse({ description: 'Throttled' })
  async upload(
    @Body() entry: ScheduleEntryDto[],
    @Param('date') date: string,
    @Headers('X-Upload-key') uploadKey?: string,
  ) {
    // TODO: implement REAL auth module
    if (uploadKey !== process.env.ALTAPI_UPLOAD_KEY) {
      throw new UnauthorizedException()
    }

    return await this.timetableService.flushAndSink(entry, date)
  }
}
