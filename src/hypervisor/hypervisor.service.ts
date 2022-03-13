import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { createHash } from 'crypto'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'
import { Model } from 'mongoose'
import { Server } from 'socket.io'
import { ScheduleEntryDto } from 'src/public-timetable/dto/schedule-entry.dto'
import { PublicTimetableService } from 'src/public-timetable/public-timetable.service'
import { ScrapperPassportDto } from './dto/passport.dto'
import { HypervisorScrapperState } from './hypervisor.enum'
import { ScrapperState, ScrapperStateDocument } from './schemas/scrapper-state.schema'
import { ScrapperVisa, ScrapperVisaDocument } from './schemas/scrapper-visa.schema'

@Injectable()
export class HypervisorService {
  private server: Server = null
  public activeScrappers: Map<string, ScrapperPassportDto> = new Map()
  private readonly logger = new Logger(HypervisorService.name)

  constructor(
    private timetables: PublicTimetableService,
    @InjectModel(ScrapperVisa.name)
    private visaModel: Model<ScrapperVisaDocument>,
    @InjectModel(ScrapperState.name)
    private statesModel: Model<ScrapperStateDocument>,
  ) {}

  public setServer(server: Server) {
    this.server = server
  }

  /**
   * This method updates states of scrappers
   * @param socketId id of ws client
   * @param state new state of scrapper
   * @returns new state entity
   */
  async updateState(socketId: string, state: HypervisorScrapperState) {
    const scrapperUuid = this.activeScrappers.get(socketId).uuid
    const visa = await this.visaModel.findOne({ 'passport.uuid': scrapperUuid })
    this.logger.log(`Update state "${state}" for "${visa.passport.name}"`)

    return await new this.statesModel({ newState: state, visa, socketId }).save()
  }

  /**
   * Creates hash used for detecting chanegs in the schedule
   * @param htmlId id of the entry (scrapped from html)
   * @returns 32 char prefix of the sha1 hash
   */
  private getChangeHash(htmlId: string, se: ScheduleEntryDto) {
    return createHash('sha1')
      .update(JSON.stringify(se))
      .update(htmlId)
      .digest('hex')
      .slice(0, 32)
  }

  /**
   * Parse (and save) uploaded schedule entry
   * @param htmlId id of the entry (scrapped from html)
   * @param htmlBody string body of the entry
   * @returns new entry entity
   */
  async saveScheduleEntry(htmlId: string, htmlBody: string) {
    const htmlFrag = JSDOM.fragment(htmlBody)
    const entry: ScheduleEntryDto = {
      name: htmlFrag.querySelector('[id*="NazwaPrzedmiotyLabel"]').textContent.trim(),
      code: htmlFrag.querySelector('[id*="KodPrzedmiotuLabel"]').textContent.trim(),
      type: htmlFrag.querySelector('[id*="TypZajecLabel"]').textContent.trim(),
      groups: htmlFrag.querySelector('[id*="GrupyLabel"]').textContent.trim().split(', '),
      building: htmlFrag.querySelector('[id*="BudynekLabel"]').textContent.trim(),
      room: htmlFrag.querySelector('[id*="SalaLabel"]').textContent.trim(),
      begin: undefined,
      end: undefined,
      tutor: htmlFrag.querySelector('[id*="DydaktycyLabel"]').textContent.trim(),
    }

    const dateBuilder = (datePart: string, timePart: string) =>
      DateTime.fromFormat(`${datePart} ${timePart}`, 'dd.MM.yyyy HH:mm:ss', {
        zone: 'Europe/Warsaw',
      })

    entry.begin = dateBuilder(
      htmlFrag.querySelector('[id*="DataZajecLabel"]').textContent.trim(),
      htmlFrag.querySelector('[id*=GodzRozpLabel]').textContent.trim(),
    ).toJSDate()

    entry.end = dateBuilder(
      htmlFrag.querySelector('[id*="DataZajecLabel"]').textContent.trim(),
      htmlFrag.querySelector('[id*=GodzZakonLabel]').textContent.trim(),
    ).toJSDate()

    if (entry.tutor === '---') entry.tutor = null

    return await this.timetables.updateOneEntry(
      htmlId,
      this.getChangeHash(htmlId, entry),
      entry,
    )
  }

  async getScrappersStatus() {
    const connectedScrappers = Array.from(this.activeScrappers.keys())

    const statuses: ScrapperState[] = []

    for (const cs of connectedScrappers) {
      statuses.push(
        await this.statesModel
          .findOne({ socketId: cs })
          .sort({ createdAt: -1 })
          .populate('visa'),
      )
    }

    return statuses.map((status) => ({
      name: status.visa.passport.name,
      uuid: status.visa.passport.uuid,
      lastState: status.newState,
      lastUpdated: status.createdAt,
    }))
  }
}
