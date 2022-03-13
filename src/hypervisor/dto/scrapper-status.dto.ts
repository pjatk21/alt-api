import { ApiProperty } from '@nestjs/swagger'
import { randomUUID } from 'crypto'
import { HypervisorScrapperState } from '../hypervisor.enum'

export class ScrapperStatusDto {
  @ApiProperty({ example: 'My little scrapper' })
  name: string

  @ApiProperty({ example: randomUUID() })
  uuid: string

  @ApiProperty({ enum: HypervisorScrapperState, example: HypervisorScrapperState.READY })
  lastState: HypervisorScrapperState

  @ApiProperty()
  lastStatus: Date
}
