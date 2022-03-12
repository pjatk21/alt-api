import { Logger, ParseEnumPipe, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { ScrapperPassportDto } from './dto/passport.dto'
import { HypervisorService } from './hypervisor.service'
import { HypervisorEvents, HypervisorScrapperState } from './hypervisor.enum'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { ScrapperVisa, ScrapperVisaDocument } from './schemas/scrapper-visa.schema'

@WebSocketGateway(4010, { transports: ['websocket', 'polling'] })
export class HypervisorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(HypervisorGateway.name)

  constructor(
    private hypervisor: HypervisorService,
    @InjectModel(ScrapperVisa.name)
    private visaModel: Model<ScrapperVisaDocument>,
  ) {}

  afterInit(server: Server) {
    this.logger.warn(`Overriding null socket with new instance`)
    this.hypervisor.socket = server
    console.log(this.hypervisor.socket)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(
      `Scrapper on socket ${client.id} connected! Args (${args.length}): ${args}`,
    )
  }

  handleDisconnect(client: Socket) {
    const discScrp = this.hypervisor.activeScrappers.get(client.id)
    this.hypervisor.activeScrappers.delete(client.id)

    this.logger.log(`Scrapper ${discScrp.name} disconnected!`)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage(HypervisorEvents.PASSPORT)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() passport: ScrapperPassportDto,
  ): Promise<WsResponse<unknown>> {
    this.logger.log(`Registeting passport ${passport.uuid} for scrapper ${passport.name}`)
    this.hypervisor.activeScrappers.set(client.id, passport)

    // TODO: move into service
    // temporarly accept all scrappers
    await this.visaModel.findOneAndUpdate(
      { 'passport.uuid': passport.uuid, 'passport.secret': passport.secret },
      { passport, active: true },
      { new: true, upsert: true },
    )

    return {
      event: HypervisorEvents.VISA,
      data: null,
    }
  }

  @SubscribeMessage(HypervisorEvents.STATE)
  async recordState(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ParseEnumPipe(HypervisorScrapperState))
    state: HypervisorScrapperState,
  ) {
    await this.hypervisor.updateState(client.id, state)
  }

  @SubscribeMessage(HypervisorEvents.SCHEDULE)
  async sinkNewEvents(
    @ConnectedSocket() client: Socket,
    @MessageBody('body') body: string,
    @MessageBody('htmlId') htmlId: string,
  ) {
    this.logger.verbose(client.id + ' + ' + htmlId)

    await this.hypervisor.saveScheduleEntry(htmlId, body)
  }
}
