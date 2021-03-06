import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Timetable, TimetableDocument } from './schemas/timetable.schema'
import { Model } from 'mongoose'
import { ScheduleEntryDto } from './dto/schedule-entry.dto'
import { DateTime } from 'luxon'
import { GroupsAvailableDto } from './dto/groups-available.dto'
import { TutorsAvailableDto } from './dto/tutors-available.dto'
import { differenceWith, isEqual } from 'lodash'
import { CalendarService } from './calendar/calendar.service'
import { PostOfficeService } from 'src/public-timetable/post-office/post-office.service'

export type ScheduleOptionalFilters = {
  groups?: string[]
  tutors?: string[]
}

/**
 * This service is responsible for distributing and processing data
 * related with PJATK timetable.
 */
@Injectable()
export class PublicTimetableService {
  private readonly logger = new Logger(PublicTimetableService.name)

  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,
    public calendar: CalendarService,
    private postOffice: PostOfficeService,
  ) {}

  /**
   * Pass scrapped and serialised data to process it, and save it to collection.
   * @param htmlId id scrapped from html
   * @param changeHash hash of content to find chages quicker
   * @param entry object with data about schedule entry
   * @returns updated/created object
   */
  async updateOneEntry(htmlId: string, changeHash: string, entry: ScheduleEntryDto) {
    const previous = await this.timetableModel.findOne({
      'entry.groups': entry.groups,
      'entry.begin': entry.begin,
      'entry.code': entry.code,
    })

    // this if statements prevents redundant writes
    if (previous)
      if (DateTime.fromJSDate(previous.updatedAt).diffNow().negate().minutes <= 5) {
        this.logger.verbose(
          `Entry ${changeHash} is already fresh, skipping update and delta check`,
        )
        return previous
      }

    const updated = await this.timetableModel.findOneAndUpdate(
      {
        'entry.groups': entry.groups,
        'entry.begin': entry.begin,
        'entry.code': entry.code,
      },
      { $set: { htmlId, changeHash, entry } },
      { new: true, upsert: true },
    )

    // this if statement prevents redundant delta check
    if (previous === null) {
      this.logger.verbose(
        `Created ${changeHash} (${entry.code} ${entry.groups}), skipping delta check`,
      )
      return updated
    }

    if (previous.changeHash === updated.changeHash) {
      this.logger.verbose(`Updated ${changeHash}, hashes matches, skipping delta check`)
      return updated
    }

    // if previous has different change hash, get delta of new and outdated entries, then send email
    this.logger.warn(`Received new hash, ${previous.changeHash} became ${changeHash}`)
    // get delta
    const delta = differenceWith(Object.entries(entry), Object.entries(previous.entry), isEqual)
    if (delta.length > 0) {
      this.logger.verbose(
        `Differnces between ${previous.entry} and ${updated.entry} : ${JSON.stringify(
          Object.fromEntries(delta),
        )}`,
      )
      this.postOffice.notifyScheduleChange(delta, updated, previous)
    } else {
      this.logger.log('Hash mismatch and delta=0, updating just hash...')
    }

    return updated
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
    let query = this.timetableModel.aggregate().match({
      'entry.begin': { $gte: dateRange.from.toBSON(), $lte: dateRange.to.toBSON() },
    })

    if (optionalFilters.groups)
      query = query.match({
        'entry.groups': { $in: optionalFilters.groups },
      })

    if (optionalFilters.tutors)
      query = query.match({
        'entry.tutors': { $in: optionalFilters.tutors },
      })

    return await query.exec()
  }

  async findSingleEntry(at: DateTime, group: string): Promise<ScheduleEntryDto | undefined> {
    const entry = await this.timetableModel.findOne({
      'entry.begin': at.toBSON(),
      'entry.groups': { $in: [group] },
    })
    return entry?.entry ?? undefined
  }

  async listAvailableGroups(): Promise<GroupsAvailableDto> {
    return this.timetableModel
      .aggregate()
      .unwind('$entry.groups')
      .project({ group: '$entry.groups' })
      .group({ _id: '$group' })
      .project({ _id: false, groupName: '$_id' })
      .group({ _id: 'groupsAvaliable', groupsAvailable: { $push: '$groupName' } })
      .project({ _id: false })
      .exec()
      .then((r) => r[0])
  }

  async listAvailableTutors(): Promise<TutorsAvailableDto> {
    return this.timetableModel
      .aggregate()
      .unwind({ path: '$entry.tutors', preserveNullAndEmptyArrays: false })
      .group({
        _id: 'tutors',
        tutorsAvailable: { $addToSet: '$entry.tutors' },
      })
      .project({ _id: false })
      .exec()
      .then((r) => r[0])
  }

  /**
   * @returns lastest timestamp for update of any entry
   */
  async lastUpdate() {
    const lastValue = await this.timetableModel.findOne().sort({ updatedAt: 'descending' })
    return DateTime.fromJSDate(lastValue.updatedAt).toISO()
  }

  async dataFetchedToDate() {
    const lastEntry = await this.timetableModel
      .aggregate()
      .project({
        _id: false,
        date: '$entry.end',
      })
      .sort({ date: -1 })
      .limit(1)
      .exec()
    return DateTime.fromJSDate(lastEntry[0].date).toISO()
  }

  async currentStatus(targets: { groups?: string[]; tutor?: string }) {
    const now = DateTime.now().toBSON()
    const activeLesson = await this.timetableModel.findOne({
      $or: [
        { 'entry.groups': { $in: targets.groups ?? [] } },
        { 'entry.tutor': targets.tutor ?? false },
      ],
      $and: [{ 'entry.begin': { $lte: now } }, { 'entry.end': { $gt: now } }],
    })
    return activeLesson
  }
}
