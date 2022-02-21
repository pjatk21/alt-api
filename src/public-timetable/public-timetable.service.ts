import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Timetable, TimetableDocument } from './schemas/timetable.schema'
import { Model } from 'mongoose'
import { ScheduleEntry } from 'pja-scrapper/dist/interfaces'
import { GroupCoder } from 'pja-scrapper/dist/groupCoder'
import { Chance } from 'chance'
import { GroupDecoded } from 'pja-scrapper/dist/types'

@Injectable()
export class PublicTimetableService {
  private readonly log = new Logger('Public timetables')

  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,
  ) {}

  async create(timetable: ScheduleEntry): Promise<TimetableDocument> {
    const createdTimetable = new this.timetableModel(timetable)
    return createdTimetable.save()
  }

  /**
   * Updates all occurances in selected date (removeMany + save)
   * @param timetable array of schedule entries
   * @param date date string
   * @returns
   */
  async sink(timetable: ScheduleEntry[], date: string) {
    const removed = await this.timetableModel.deleteMany({ 'entry.dateString': date })
    this.log.verbose(`Overriding ${removed.deletedCount} results`)

    for (const entry of timetable) {
      await new this.timetableModel({ entry }).save()
    }

    return {
      result: removed.deletedCount ? 'replaced' : 'added',
    }
  }

  async timetableForDay(date: string) {
    return await this.timetableModel.find({
      'entry.dateString': date,
    })
  }

  async timetableForGroup(date: string, group: string | GroupDecoded) {
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const groupSafe = typeof group === 'string' ? new GroupCoder().decode(group) : group
    return await this.timetableModel.find({
      'entry.dateString': date,
      'entry.groups': { $elemMatch: groupSafe },
    })
  }

  async createMock(): Promise<TimetableDocument> {
    const chance = new Chance()
    const mockedDate = Date.now() - Math.random() * 3600 * 24 * 10

    const entry: ScheduleEntry = {
      begin: new Date(mockedDate),
      end: new Date(mockedDate + 3600 * 1.5),
      dateString: '1980-01-01',
      code: chance.string({ casing: 'upper', length: 3 }),
      name: chance.word(),
      room: 'A420',
      type: 'ćwiczenia',
      building: 'A',
      groups: [
        new GroupCoder().decode(
          `WIs I.1 - ${chance.integer({ min: 4, max: 50 })}${chance.letter({
            casing: 'lower',
          })}`,
        ),
      ],
    }

    const mockTimetable = new this.timetableModel({
      uploadedAt: new Date(),
      entry,
    })
    return mockTimetable.save()
  }

  async lastUpdate() {
    const lastValue = await this.timetableModel
      .findOne()
      .sort({ uploadedAt: 'descending' })
    return lastValue.uploadedAt.toISOString()
  }
}
