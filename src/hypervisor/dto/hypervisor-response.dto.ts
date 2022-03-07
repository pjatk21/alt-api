import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export enum HypervisorResponseStatus {
  DONE = 'done', // action started and finished (like db update)
  ASSIGNED = 'assigned', // action assigned and started (like scrap request)
  REJECTED = 'rejected', // action can't be assigned
}

export class HypervisorResponseDto {
  @ApiProperty({ enum: HypervisorResponseStatus, example: HypervisorResponseStatus.DONE })
  status: HypervisorResponseStatus

  @ApiPropertyOptional({ example: 'Accpeted passport of Scrappy #21' })
  message?: string

  @ApiPropertyOptional({ example: { signature: 'ztb2/16,7sda2137hdHJgaj' } })
  context?: unknown
}
