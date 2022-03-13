import {
  Logger,
  ParseEnumPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
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
import { HypervisorGuard } from './hypervisor.guard'
import { DispositorService } from './dispositor/dispositor.service'

@WebSocketGateway(4010, { transports: ['websocket', 'polling'] })
export class HypervisorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(HypervisorGateway.name)

  constructor(
    private hypervisor: HypervisorService,
    private dispositor: DispositorService,
    @InjectModel(ScrapperVisa.name)
    private visaModel: Model<ScrapperVisaDocument>,
  ) {}

  afterInit(server: Server) {
    this.logger.warn('Populating WS server among services...')
    this.hypervisor.setServer(server)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(
      `Scrapper on socket ${client.id} connected! Args (${args.length}): ${args}`,
    )
  }

  handleDisconnect(client: Socket) {
    const discScrp = this.hypervisor.activeScrappers.get(client.id)
    if (discScrp) {
      this.hypervisor.activeScrappers.delete(client.id)
      this.dispositor.cleanupOnDisconnect(client)

      this.logger.log(`Scrapper ${discScrp.name} disconnected!`)
    } else {
      this.logger.warn(`Non-registered scrapper on socket ${client.id} disconnected!`)
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage(HypervisorEvents.PASSPORT)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() passport: ScrapperPassportDto,
  ): Promise<WsResponse<unknown>> {
    if (
      Array.from(this.hypervisor.activeScrappers.values())
        .map((p) => p.uuid)
        .includes(passport.uuid)
    ) {
      this.logger.warn(
        `Scrapper ${passport.name} already connected! Disconnecting socket!`,
      )
      client.disconnect()
    }

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

  @UseGuards(HypervisorGuard)
  @SubscribeMessage(HypervisorEvents.STATE)
  async recordState(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ParseEnumPipe(HypervisorScrapperState))
    state: HypervisorScrapperState,
  ) {
    await this.hypervisor.updateState(client.id, state)
    if (state === HypervisorScrapperState.READY) {
      this.dispositor.releaseTask(client)
      this.dispositor.assignTask(client)
    }
  }

  @UseGuards(HypervisorGuard)
  @SubscribeMessage(HypervisorEvents.SCHEDULE)
  async sinkNewEvents(
    @ConnectedSocket() client: Socket,
    @MessageBody('body') body: string,
    @MessageBody('htmlId') htmlId: string,
  ) {
    const { entry } = await this.hypervisor.saveScheduleEntry(htmlId, body)
    const passport = this.hypervisor.activeScrappers.get(client.id)
    this.logger.verbose(
      `${passport.name} uploaded "${entry.code}" for "${
        entry.groups
      }" at "${entry.begin.toISOString()}"`,
    )
  }
}
