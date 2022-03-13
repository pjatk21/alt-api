import { ApiProperty } from '@nestjs/swagger'

export class VisaRequestDto {
  @ApiProperty({
    description: 'UUID of scrapper',
    example: '9bb52393-cf6d-49a2-8848-fc07c5aa44f6',
  })
  uuid: string

  @ApiProperty({
    description: 'Name assigned to the scrapper',
    example: 'Scrapper #3',
  })
  name: string

  @ApiProperty({
    description: 'ObjectId of visa document',
    example: '6223669f8b3f4646f6d9b672',
  })
  visa: string
}
