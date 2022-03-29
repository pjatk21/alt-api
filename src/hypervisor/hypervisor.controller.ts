import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ScrapperStatusDto } from './dto/scrapper-status.dto'
import { HypervisorService } from './hypervisor.service'
import { ScrapperState } from './schemas/scrapper-state.schema'

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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('history/:uuid')
  @ApiOperation({ summary: "Get scrapper's historical states" })
  @ApiResponse({ type: [ScrapperState] })
  async historyByUuid(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return await this.hypervisor.getScrapperStateHistory(uuid).then((r) =>
      r.map(({ createdAt, newState }) => ({
        newState,
        createdAt,
      })),
    )
  }
}
