import {
  Body,
  Controller,
  Get,
  ParseEnumPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { HypervisorCommnandRequestDto } from './dto/hypervisor-command-request.dto'
import {
  HypervisorResponseDto,
  HypervisorResponseStatus,
} from './dto/hypervisor-response.dto'
import { VisaRequestDto } from './dto/visa-request.dto'
import { ScrapperVisaDispositionDto } from './dto/visa.dto'
import { HypervisorEvents, HypervisorScrapperCommands } from './hypervisor.enum'
import { HypervisorService } from './hypervisor.service'
import { HypervisorCommandExec } from './hypervisor.types'
import { ScrapperState } from './schemas/scrapper-state.schema'

@Controller('hypervisor')
@ApiTags('Hypervisor')
export class HypervisorController {
  constructor(private hypervisor: HypervisorService) {}

  @Get('visa/awaiting')
  @ApiOkResponse({
    type: [VisaRequestDto],
  })
  async scrappersAwaitingVisa(): Promise<VisaRequestDto[]> {
    return await this.hypervisor.getVisaRequests()
  }

  @Patch('visa/dispose')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: "Accepts scrapper's authentication request",
  })
  @ApiBody({ type: ScrapperVisaDispositionDto })
  @ApiCreatedResponse({
    type: HypervisorResponseDto,
  })
  async visa(
    @Body() disposition: ScrapperVisaDispositionDto,
  ): Promise<HypervisorResponseDto> {
    const vr = await this.hypervisor.getVisaRequest(disposition.visaId)
    vr.active = true
    const state = await this.hypervisor.sendVisa(vr.socketId, {
      accepted: true,
      visaId: vr._id,
    })

    return {
      status: HypervisorResponseStatus.DONE,
      message: `Set state of ${vr.passport.friendlyName} to ${state.newState}@${state._id}`,
    }
  }

  @Post('command')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Manage with working scrappers',
  })
  @ApiResponse({ type: HypervisorResponseDto })
  @ApiBody({ type: HypervisorCommnandRequestDto })
  async manage(@Body() cmdReq: HypervisorCommnandRequestDto): Promise<HypervisorResponseDto> {
    
    return {
      status: HypervisorResponseStatus.ASSIGNED,
    }
  }
}
