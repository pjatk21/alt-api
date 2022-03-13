import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString } from 'class-validator'

export class ScrapperVisaDispositionDto {
  @ApiProperty({ example: '6223669f8b3f4646f6d9b674' })
  @IsString()
  visaId: string

  @ApiProperty({ example: true })
  @IsBoolean()
  accepted: boolean

  @ApiProperty({ required: false })
  @IsString()
  reason?: string
}
