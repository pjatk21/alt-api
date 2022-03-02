import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Timetable, TimetableDocument } from './schemas/timetable.schema'
import { Model } from 'mongoose'
import { ScheduleEntryDto } from './dto/schedule-entry.dto'
import { DateTime } from 'luxon'
import { GroupsAvailableDto } from './dto/groups-available.dto'
import { TutorsAvailableDto } from './dto/tutors-available.dto'

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
      .sort({ uploadedAt: 'descending' })
    return DateTime.fromJSDate(lastValue.uploadedAt).toISO()
  }
}
