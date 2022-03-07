import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets'
import EventEmitter from 'events'
import { Server } from 'socket.io'
import { Socket } from 'socket.io-client'
import { HypervisorEvents } from './hypervisor.enum'
import { HypervisorService } from './hypervisor.service'

@Controller('hypervisor')
@ApiTags('Hypervisor')
export class HypervisorController {
  constructor(private hypervisor: HypervisorService) {}

  @Post('visa/accept')
  @ApiOperation({
    summary: "Accepts scrapper's authentication request",
  })
  async visa(@Body('oid') oid: string) {
    const vr = await this.hypervisor.getVisaRequest(oid)
    const { id, socketId } = vr
    vr.active = true
    this.hypervisor.sendVisa(socketId, { accepted: true, visaId: id })
    return { staus: 'done!' }
  }

  @Post('manage')
  @ApiOperation({
    summary: 'Manage with working scrappers',
  })
  async manage(@Body('socketId') socketId: string) {
    this.hypervisor.socket.to(socketId).emit(HypervisorEvents.COMMAND, 'disconnect')
    return { staus: 'done!' }
  }
}
