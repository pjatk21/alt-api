import { Body, Controller, Get, ParseEnumPipe, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HypervisorEvents, HypervisorScrapperCommands } from './hypervisor.enum'
import { HypervisorService } from './hypervisor.service'
import { HypervisorCommandExec } from './hypervisor.types'

@Controller('hypervisor')
@ApiTags('Hypervisor')
export class HypervisorController {
  constructor(private hypervisor: HypervisorService) {}

  @Get('scrappers')
  async scrappers() {
    return []
  }

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
  async manage(
    @Body('socketId') socketId: string,
    @Body('command', new ParseEnumPipe(HypervisorScrapperCommands))
    command: HypervisorScrapperCommands,
  ) {
    this.hypervisor.socket.to(socketId).emit(HypervisorEvents.COMMAND, {
      command,
    } as HypervisorCommandExec)
    return { staus: 'done!' }
  }
}
