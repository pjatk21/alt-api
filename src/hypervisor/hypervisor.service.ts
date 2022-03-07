import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Socket, Server } from 'socket.io'
import { ScrapperPassportDto } from './dto/passport.dto'
import { ScrapperVisaResponseDto } from './dto/visa.dto'
import { HypervisorScrapperState } from './hypervisor.enum'
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
      visa,
      newState: state,
    }).save()
    return stateRecord
  }

  async handleVisaRequest(socket: Socket, passport: ScrapperPassportDto) {
    return await new this.visaModel({
      socketId: socket.id,
      passport,
    })
      .save()
      .then((vm) => vm._id)
  }

  async getVisaRequest(oid: string) {
    return await this.visaModel.findOne({ _id: oid })
  }

  async sendVisa(socketId: string, visa: ScrapperVisaResponseDto) {
    this.socket.to(socketId).emit('visa', visa)
  }
}
