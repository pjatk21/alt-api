import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Socket, Server } from 'socket.io'
import { ScrapperPassportDto } from './dto/passport.dto'
import { VisaRequestDto } from './dto/visa-request.dto'
import { ScrapperVisaDispositionDto } from './dto/visa.dto'
import { HypervisorEvents, HypervisorScrapperState } from './hypervisor.enum'
import { HypervisorCommandExec } from './hypervisor.types'
import { ScrapperState, ScrapperStateDocument } from './schemas/scrapper-state.schema'
import { ScrapperVisa, ScrapperVisaDocument } from './schemas/scrapper-visa.schema'

export enum HypervisorInternalEvents {
  VISA = 'visa',
}

@Injectable()
export class HypervisorService {
  public socket: Server = null

  constructor(
    private events: EventEmitter2,
    @InjectModel(ScrapperVisa.name)
    private visaModel: Model<ScrapperVisaDocument>,
    @InjectModel(ScrapperState.name)
    private statesModel: Model<ScrapperStateDocument>,
  ) {}

  async updateState(socketId: string, state: HypervisorScrapperState) {
    const visa = await this.visaModel.findOne({ socketId })
    const stateRecord = await new this.statesModel({
      socketId,
      visa,
      newState: state,
    }).save()
    return stateRecord
  }

  async assignCommand(uuid: string, command: HypervisorCommandExec) {
    const visa = await this.visaModel.findOne({
      passport: {
        uuid,
      },
    })

    this.socket.to(visa.socketId).emit(HypervisorEvents.COMMAND, command)
  }

  async handleVisaRequest(socket: Socket, passport: ScrapperPassportDto) {
    return await new this.visaModel({
      socketId: socket.id,
      passport,
    })
      .save()
      .then((vm) => vm._id)
  }

  async checkPassport(socketId: string, passport: ScrapperPassportDto) {
    const visa = await this.visaModel.findOne({
      passport: {
        uuid: passport.uuid,
        presharedKey: passport.presharedKey,
      },
    })

    if (!visa) return false

    visa.socketId = socketId
    visa.save()

    return true
  }

  async getVisaRequests(): Promise<VisaRequestDto[]> {
    return await this.visaModel.find({ active: false }).then((coll) =>
      coll.map((d) => ({
        uuid: d.passport.uuid,
        name: d.passport.friendlyName,
        visa: d._id,
      })),
    )
  }

  async getVisaRequest(visaId: string) {
    return await this.visaModel.findOne({ _id: visaId, active: false })
  }

  async sendVisa(socketId: string, visa: ScrapperVisaDispositionDto) {
    this.socket.to(socketId).emit('visa', visa)
    const registrationEvent = await new this.statesModel({
      socketId,
      visa,
      newState: HypervisorScrapperState.REGISTRATION,
    }).save()
    return registrationEvent
  }
}
