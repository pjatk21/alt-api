import { ApiProperty } from '@nestjs/swagger'

export class TutorsAvailableDto {
  @ApiProperty({
    type: [String],
    description: 'List of available tutors',
    example: ['Michał Tomaszewski'],
  })
  tutorsAvailable: string[]
}
