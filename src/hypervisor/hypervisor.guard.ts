import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { HypervisorService } from './hypervisor.service'
import { Socket } from 'socket.io'

@Injectable()
export class HypervisorGuard implements CanActivate {
  constructor(private readonly hypervisor: HypervisorService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(context)
    const message = context.switchToWs()
    const client = message.getClient() as Socket
    console.log('Testing ' + client.id)
    if (this.hypervisor.activeScrappers.has(client.id)) return true
    return false
  }
}
