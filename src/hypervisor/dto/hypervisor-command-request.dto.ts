import { ApiProperty } from '@nestjs/swagger'
import { HypervisorScrapperCommands } from '../hypervisor.enum'

export class HypervisorCommnandRequestDto {
  @ApiProperty()
  scrapper: string

  @ApiProperty({ enum: HypervisorScrapperCommands })
  command: HypervisorScrapperCommands
}
