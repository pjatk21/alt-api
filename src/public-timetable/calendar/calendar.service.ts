import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Timetable, TimetableDocument } from '../schemas/timetable.schema'
import type { ScheduleOptionalFilters } from '../public-timetable.service'
import { createHash } from 'crypto'
import { EventAttributes, Alarm, createEvents } from 'ics'
import { DateTime } from 'luxon'

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,
  ) {}

  private createICSEvent(row: Timetable): EventAttributes {
    const re = row.entry
    const begin = DateTime.fromJSDate(re.begin).setZone()
    const end = DateTime.fromJSDate(re.end).setZone()

    const eventHashId =
      'altid-' +
      createHash('sha1')
        .update(re.begin.getTime().toString())
        .update(re.groups.toString())
        .update(re.code)
        .update(re.room)
        .update(re.tutors.join(','))
        .digest('hex')
        .slice(0, 20)

    return {
      uid: eventHashId,
      productId: 'altapi/ics',
      start: [begin.year, begin.month, begin.day, begin.hour, begin.minute],
      end: [end.year, end.month, end.day, end.hour, end.minute],
      title: `${re.type} z ${re.code} (${re.room})`,
      description: `${re.type} z ${re.name} w budynku ${re.room} prowadzone przez ${re.tutors}.`,
      busyStatus: 'BUSY',
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
  }

  async createICS(optionalFilters: ScheduleOptionalFilters) {
    if (!(optionalFilters.groups || optionalFilters.tutors))
      throw new Error('Specify groups or tutor!')

    const rawEntries: Timetable[] = await this.timetableModel
      .aggregate([
        {
          $project: {
            entry: true,
            group: '$entry.groups',
            uploadedAt: true,
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

    const events: EventAttributes[] = rawEntries.map(this.createICSEvent)
    const icsBuild = createEvents(events)
    return {
      ics: icsBuild.value,
      err: icsBuild.error,
    }
  }
}
