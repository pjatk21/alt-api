import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Headers,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  UnauthorizedException,
  UseInterceptors,
  Response,
  HttpException,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiProperty,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Response as Res } from 'express'
import { DateTime } from 'luxon'
import { HttpExceptionResponseDto } from 'src/dto/http-exception-response.dto'
import { GroupsAvailableDto } from './dto/groups-available.dto'
import { ScheduleEntryDto } from './dto/schedule-entry.dto'
import { ScheduleResponseDto } from './dto/schedule-response.dto'
import { TutorsAvailableDto } from './dto/tutors-available.dto'
import { ParseDateIsoPipe } from './parse-date-iso.pipe'
import { ParseDateYmdPipe } from './parse-date-ymd.pipe'
import { PublicTimetableService } from './public-timetable.service'

class UploadResponseMock {
  @ApiProperty({ enum: ['replaced', 'added'] })
  result: string
}

@Controller({
  version: '1',
  path: '/timetable',
})
export class PublicTimetableController {
  constructor(private timetableService: PublicTimetableService) {}

  @Get('/date/:date')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get a schedule for a specified day',
    description:
      'You can pass groups as a query param, if none passed, all entries are returned.',
  })
  @ApiParam({ name: 'date', example: '2022-03-07' })
  @ApiQuery({
    name: 'groups',
    type: [String],
    required: false,
    example: ['WIs I.2 - 46c', 'WIs I.2 - 138l', 'WIs I.2 - 1w'],
  })
  @ApiQuery({
    name: 'tutors',
    type: [String],
    required: false,
    example: ['Piotr Kosiński'],
  })
  @ApiOkResponse({ type: ScheduleResponseDto })
  async byDate(
    @Param('date', new ParseDateYmdPipe()) date: DateTime,
    @Query(
      'groups',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    groups?: string[],
    @Query(
      'tutors',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    tutors?: string[],
  ) {
    const entries = await this.timetableService.timetableForDay(date, { groups, tutors })

    return {
      entries: entries.map((e) => e.entry),
    }
  }

  @Get('range')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get a schedule for a specified date range',
  })
  @ApiQuery({
    name: 'from',
    type: 'string',
    description: 'ISO format of a date',
    example: DateTime.local().toISO(),
  })
  @ApiQuery({
    name: 'to',
    type: 'string',
    description: 'ISO format of a date',
    example: DateTime.local().plus({ hours: 8 }).toISO(),
  })
  @ApiQuery({
    name: 'groups',
    type: [String],
    required: false,
    example: ['WIs I.2 - 46c', 'WIs I.2 - 40c'],
  })
  @ApiQuery({
    name: 'tutors',
    type: [String],
    required: false,
    example: ['Piotr Kosiński'],
  })
  @ApiOkResponse({ type: ScheduleResponseDto })
  async byRange(
    @Query('from', new ParseDateIsoPipe()) from: DateTime,
    @Query('to', new ParseDateIsoPipe()) to: DateTime,
    @Query(
      'groups',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    groups?: string[],
    @Query(
      'tutors',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    tutors?: string[],
  ) {
    const entries = await this.timetableService.timetableForDateRange(
      {
        from,
        to,
      },
      { groups, tutors },
    )

    return {
      entries: entries.map((e) => e.entry),
    }
  }

  @Get('/single')
  @ApiOperation({
    summary: 'Get single schedule entry',
    description:
      'Get a single schedule entry, just a shorthand for filtering /timetable/range.',
  })
  @ApiQuery({
    name: 'at',
    description: 'ISO format of date of begin of the class/entry',
    type: String,
  })
  @ApiQuery({
    name: 'group',
    description: 'Name of the group',
    example: 'WIs I.2 - 46c',
    type: String,
  })
  @ApiOkResponse({
    type: ScheduleEntryDto,
  })
  @ApiNotFoundResponse({
    type: HttpExceptionResponseDto,
  })
  async getSingleEntry(
    @Query('at', new ParseDateIsoPipe()) atDate: DateTime,
    @Query('group') group: string,
  ) {
    const se = await this.timetableService.findSingleEntry(atDate, group)
    if (se) return se
    else throw new NotFoundException()
  }

  @Get('/groups')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get all available groups',
    description: 'Useful for auto-complete controls',
  })
  @ApiOkResponse({ type: GroupsAvailableDto })
  async getAvailableGroups(): Promise<GroupsAvailableDto> {
    return await this.timetableService.listAvailableGroups()
  }

  @Get('/tutors')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get all available tutors',
    description: 'Useful for auto-complete controls',
  })
  @ApiOkResponse({ type: TutorsAvailableDto })
  async getAvailableTutors(): Promise<TutorsAvailableDto> {
    return await this.timetableService.listAvailableTutors()
  }

  @Get('/index.ics')
  @ApiOperation({
    summary: 'Subscribe to ICS calendar',
    description:
      'Returns ICS file of your whole available schedule. Can be used as a subscription feed for calendar.',
  })
  @ApiQuery({
    name: 'groups',
    type: [String],
    example: ['WIs I.2 - 46c', 'WIs I.2 - 1w'],
    description: 'Group names to fetch calendar.',
    schema: {
      minItems: 1,
    },
  })
  @ApiProduces('text/calendar')
  @ApiOkResponse({
    type: String,
    description: 'Returns an ICS file, defaults filename to AltapiSchedule.ics',
  })
  @ApiBadRequestResponse({
    type: Object,
    description: 'Usually raised if not enough groups are passed',
  })
  async getIcsSchedule(
    @Response() res: Res,
    @Query('groups', new ParseArrayPipe({ items: String, separator: ',' }))
    groups: string[],
  ) {
    if ((groups ?? []).length < 1)
      throw new HttpException('You have to choose at least one group!', 400)

    const { ics, err } = await this.timetableService.createICS({
      groups,
    })

    if (!ics) throw new HttpException(err, 418) // 🫖

    return res.contentType('.ics').attachment('AltapiSchedule.ics').send(ics)
  }

  @Post('/upload/:date')
  @ApiOperation({
    summary: 'Upload a schedule for a selected date',
    description:
      "Endpoint dedicated for scrappers to provide new data. Regular users won't use that.",
    deprecated: true,
  })
  @ApiTags('Admin')
  @ApiBody({ type: [ScheduleEntryDto] })
  @ApiHeader({ name: 'X-Upload-key' })
  @ApiCreatedResponse({
    description: 'Created/updated schedule',
    type: UploadResponseMock,
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid X-Upload-key',
    type: UnauthorizedException,
  })
  async upload(
    @Body(new ParseArrayPipe({ items: ScheduleEntryDto, enableDebugMessages: true }))
    entry: ScheduleEntryDto[],
    @Param('date', new ParseDateYmdPipe()) date: DateTime,
    @Headers('X-Upload-key') uploadKey?: string,
  ) {
    // TODO: implement REAL auth module
    if (
      uploadKey !== process.env.ALTAPI_UPLOAD_KEY ||
      process.env.ALTAPI_UNSECURE == '1'
    ) {
      throw new UnauthorizedException()
    }

    return await this.timetableService.flushAndSink(entry, date)
  }
}
