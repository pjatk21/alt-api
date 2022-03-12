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

@WebSocketGateway(4010, { transports: ['websocket', 'polling'] })
export class HypervisorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(HypervisorGateway.name)

  constructor(private hypervisor: HypervisorService) {}

  afterInit(server: Server) {
    this.logger.warn(`Overriding null socket with ${server}`)
    this.hypervisor.socket = server
    console.log(this.hypervisor.socket)
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Scrapper ${client.id} connected! Args (${args.length}): ${args}`)
  }

  handleDisconnect(client: any) {
    this.logger.log(`Scrapper ${client.id} disconnected!`)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage(HypervisorEvents.PASSPORT)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() passport: ScrapperPassportDto,
  ): Promise<WsResponse<unknown>> {
    // const visaRequestId = await this.hypervisor.handleVisaRequest(client, passport)

    this.hypervisor.activeScrappers.set(passport.uuid, {
      ...passport,
      socketId: client.id,
    })

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
