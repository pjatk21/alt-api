import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Timetable, TimetableDocument } from './schemas/timetable.schema'
import { Model } from 'mongoose'
import { ScheduleEntryDto } from './dto/schedule-entry.dto'
import { DateTime } from 'luxon'

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

  async timetableForDay(date: DateTime, groups?: string[]) {
    let query = {
      'entry.begin': {
        $gte: date.toBSON(),
        $lte: date.endOf('day').toBSON(),
      },
    }

    if (groups)
      query = Object.assign(query, {
        'entry.groups': { $in: groups },
      })

    return await this.timetableModel.find(query)
  }

  async lastUpdate() {
    const lastValue = await this.timetableModel
      .findOne()
      .sort({ uploadedAt: 'descending' })
    return DateTime.fromJSDate(lastValue.uploadedAt).toISO()
  }
}
