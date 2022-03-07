import { Logger, ParseEnumPipe, UsePipes, ValidationPipe } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { createHash, randomBytes } from 'crypto'
import { ScrapperPassportDto } from './dto/passport.dto'
import { ScrapperVisaResponseDto } from './dto/visa.dto'
import { HypervisorService } from './hypervisor.service'
import { HypervisorEvents, HypervisorScrapperState } from './hypervisor.enum'

@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class HypervisorGateway implements OnGatewayInit {
  private readonly logger = new Logger('Hypervisor Gateway')

  constructor(private hypervisor: HypervisorService) {}

  afterInit(server: Server) {
    this.logger.warn(`Overriding null socket with ${server}`)
    this.hypervisor.socket = server
    console.log(this.hypervisor.socket)
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage(HypervisorEvents.PASSPORT)
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() passport: ScrapperPassportDto,
  ): Promise<WsResponse<unknown>> {
    const visaRequestId = await this.hypervisor.handleVisaRequest(client, passport)
    return {
      event: 'visa-status',
      data: {
        visaRequestId,
      },
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
}
