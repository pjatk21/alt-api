import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ScrapperStatusDto } from './dto/scrapper-status.dto'
import { HypervisorService } from './hypervisor.service'

@Controller('hypervisor')
@ApiTags('Hypervisor')
export class HypervisorController {
  constructor(private hypervisor: HypervisorService) {}

  @Get('scrappers')
  @ApiOperation({ summary: 'Display active scrappers' })
  @ApiResponse({ type: [ScrapperStatusDto] })
  async scrappers() {
    return this.hypervisor.getScrappersStatus()
  }
}
