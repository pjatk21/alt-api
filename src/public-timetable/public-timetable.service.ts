import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Timetable, TimetableDocument } from './schemas/timetable.schema'
import { Model } from 'mongoose'
import { ScheduleEntryDto } from './dto/schedule-entry.dto'
import { DateTime } from 'luxon'
import { GroupsAvailableDto } from './dto/groups-available.dto'
import { TutorsAvailableDto } from './dto/tutors-available.dto'
import { Alarm, createEvents, EventAttributes } from 'ics'

type ScheduleOptionalFilters = {
  groups?: string[]
  tutors?: string[]
}

@Injectable()
export class PublicTimetableService {
  private readonly log = new Logger('Public timetables')

  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,
  ) {}

  async create(timetable: ScheduleEntryDto): Promise<TimetableDocument> {
    const createdTimetable = new this.timetableModel(timetable)
    return createdTimetable.save()
  }

  /**
   * Updates all occurances in selected date (removeMany + save)
   * @param timetable array of schedule entries
   * @param date date string
   * @deprecated
   * @returns
   */
  async flushAndSink(timetable: ScheduleEntryDto[], date: DateTime) {
    const removed = await this.timetableModel.deleteMany({
      'entry.begin': {
        $gte: date.toBSON(),
        $lte: date.endOf('day').toBSON(),
      },
    })
    this.log.verbose(`Overriding ${removed.deletedCount} results`)

    for (const entry of timetable) {
      await new this.timetableModel({ entry }).save()
    }

    return {
      result: removed.deletedCount ? 'replaced' : 'added',
    }
  }

  async updateOneEntry(htmlId: string, changeHash: string, entry: ScheduleEntryDto) {
    await this.timetableModel.findOneAndUpdate(
      {
        htmlId,
        changeHash: { $ne: changeHash },
      },
      { $set: { changeHash, entry } },
      { upsert: true },
    )
  }

  async timetableForDay(date: DateTime, optionalFilters: ScheduleOptionalFilters) {
    return await this.timetableForDateRange(
      {
        from: date,
        to: date.endOf('day'),
      },
      optionalFilters,
    )
  }

  async timetableForDateRange(
    dateRange: { from: DateTime; to: DateTime },
    optionalFilters: ScheduleOptionalFilters,
  ) {
    const dateRangeQuery = {
      'entry.begin': {
        $gte: dateRange.from.toBSON(),
        $lte: dateRange.to.toBSON(),
      },
    }

    const groupsQuery = optionalFilters.groups?.length
      ? {
          'entry.groups': { $in: optionalFilters.groups },
        }
      : undefined
    const tutorsQuery = optionalFilters.tutors?.length
      ? {
          'entry.tutor': { $in: optionalFilters.tutors },
        }
      : undefined

    return await this.timetableModel.find(
      Object.assign(dateRangeQuery, groupsQuery, tutorsQuery),
    )
  }

  async createICS(optionalFilters: ScheduleOptionalFilters) {
    if (!(optionalFilters.groups || optionalFilters.tutors))
      throw new Error('Specify groups or tutor!')

    const rawEntries: ScheduleEntryDto[] = await this.timetableModel
      .aggregate([
        {
          $project: {
            entry: true,
            group: '$entry.groups',
          },
        },
        {
          $unwind: '$group',
        },
        {
          $match: {
            $expr: {
              $or: [{ $in: ['$group', optionalFilters.groups] }],
            },
          },
        },
      ])
      .exec()
      .then((rows) => rows.map((row) => row.entry))
    const events: EventAttributes[] = rawEntries.map((re) => {
      const begin = DateTime.fromJSDate(re.begin).setZone()
      const end = DateTime.fromJSDate(re.end).setZone()
      const previewUrl = new URL('https://altapi.kpostek.dev/preview')
      previewUrl.searchParams.append('at', begin.toISO())
      previewUrl.searchParams.append('group', re.groups[0])

      return {
        start: [begin.year, begin.month, begin.day, begin.hour, begin.minute],
        end: [end.year, end.month, end.day, end.hour, end.minute],
        title: `${re.type} z ${re.code} (${re.room})`,
        description: `${re.type} z ${re.name} w budynku ${re.room} prowadzone przez ${re.tutor}.`,
        busyStatus: 'BUSY',
        url: previewUrl.toString(),
        alarms: [
          {
            action: 'display',
            trigger: {
              before: true,
              minutes: 15,
            },
          } as Alarm,
        ],
      }
    })
    const icsBuild = createEvents(events)
    return {
      ics: icsBuild.value,
      err: icsBuild.error,
    }
  }

  async findSingleEntry(
    at: DateTime,
    group: string,
  ): Promise<ScheduleEntryDto | undefined> {
    const entry = await this.timetableModel.findOne({
      'entry.begin': at.toBSON(),
      'entry.groups': { $in: [group] },
    })
    return entry?.entry ?? undefined
  }

  async listAvailableGroups(): Promise<GroupsAvailableDto> {
    return this.timetableModel
      .aggregate([
        { $unwind: '$entry.groups' },
        {
          $project: {
            group: '$entry.groups',
          },
        },
        {
          $group: {
            _id: '$group',
          },
        },
        {
          $project: {
            _id: false,
            groupName: '$_id',
          },
        },
        {
          $group: {
            _id: 'groupsAvaliable',
            groupsAvailable: { $push: '$groupName' },
          },
        },
        {
          $project: {
            _id: false,
          },
        },
      ])
      .exec()
      .then((r) => r[0])
  }

  async listAvailableTutors(): Promise<TutorsAvailableDto> {
    return this.timetableModel
      .aggregate([
        {
          $match: {
            $expr: { $ne: ['$entry.tutor', null] },
          },
        },
        {
          $group: {
            _id: 'tutors',
            tutorsAvailable: { $addToSet: '$entry.tutor' },
          },
        },
        {
          $project: {
            _id: false,
          },
        },
      ])
      .exec()
      .then((r) => r[0])
  }

  async lastUpdate() {
    const lastValue = await this.timetableModel
      .findOne()
      .sort({ updatedAt: 'descending' })
    return DateTime.fromJSDate(lastValue.updatedAt).toISO()
  }

  async dataFetchedToDate() {
    const lastEntry = await this.timetableModel
      .aggregate([
        {
          $project: {
            _id: false,
            date: '$entry.end',
          },
        },
        {
          $sort: { date: -1 },
        },
        {
          $limit: 1,
        },
      ])
      .exec()
    return DateTime.fromJSDate(lastEntry[0].date).toISO()
  }
}
