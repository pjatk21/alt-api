import { ApiProperty } from '@nestjs/swagger'

export class GroupsAvailableDto {
  @ApiProperty({
    type: [String],
    description: 'List of available groups',
    example: ['WIs I.2 - 1w', 'WIs I.2 - 46c'],
  })
  groupsAvailable: string[]
}
