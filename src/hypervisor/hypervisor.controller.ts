import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common'
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
    return await this.hypervisor.getScrappersStatus().then((s) =>
      s.map((x) => {
        x.socket = undefined
        return x
      }),
    )
  }

  @Get('history/:uuid')
  async historyByUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.hypervisor.getScrapperStateHistory(uuid)
  }
}
