import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { HypervisorService } from './hypervisor.service'
import { Socket } from 'socket.io'

@Injectable()
export class HypervisorGuard implements CanActivate {
  private readonly logger = new Logger(HypervisorGuard.name)

  constructor(private readonly hypervisor: HypervisorService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const message = context.switchToWs()
    const client = message.getClient() as Socket

    if (this.hypervisor.activeScrappers.has(client.id)) return true

    this.logger.warn(
      `Refusing connection from socket ${client.id} from ip ${client.handshake.address}!`,
    )
    return false
  }
}
