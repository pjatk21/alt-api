import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { createHash } from 'crypto'
import { JSDOM } from 'jsdom'
import { DateTime } from 'luxon'
import { Model } from 'mongoose'
import { Socket, Server } from 'socket.io'
import { ScheduleEntryDto } from 'src/public-timetable/dto/schedule-entry.dto'
import { PublicTimetableService } from 'src/public-timetable/public-timetable.service'
import { ScrapperPassportDto } from './dto/passport.dto'
import { VisaRequestDto } from './dto/visa-request.dto'
import { ScrapperVisaDispositionDto } from './dto/visa.dto'
import { HypervisorEvents, HypervisorScrapperState } from './hypervisor.enum'
import { HypervisorCommandExec } from './hypervisor.types'
import { ScrapperState, ScrapperStateDocument } from './schemas/scrapper-state.schema'
import { ScrapperVisa, ScrapperVisaDocument } from './schemas/scrapper-visa.schema'

@Injectable()
export class HypervisorService {
  public socket: Server = null
  public activeScrappers: Map<string, ScrapperPassportDto> = new Map()

  constructor(
    private timetables: PublicTimetableService,
    @InjectModel(ScrapperVisa.name)
    private visaModel: Model<ScrapperVisaDocument>,
    @InjectModel(ScrapperState.name)
    private statesModel: Model<ScrapperStateDocument>,
  ) {}

  async updateState(socketId: string, state: HypervisorScrapperState) {
    const scrapperUuid = this.activeScrappers.get(socketId).uuid
    const visa = await this.visaModel.findOne({ 'passport.uuid': scrapperUuid })
    return await new this.statesModel({ newState: state, visa, socketId }).save()
  }

  getChangeHash(htmlId: string, htmlBody: string) {
    return createHash('sha1').update(htmlBody).update(htmlId).digest('hex').slice(0, 32)
  }

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
      tutor: htmlFrag.querySelector('[id*="TypZajecLabel"]').textContent.trim(),
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

    this.timetables.updateOneEntry(htmlId, this.getChangeHash(htmlId, htmlBody), entry)
  }
}
