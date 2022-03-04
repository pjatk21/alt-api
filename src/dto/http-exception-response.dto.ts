import { ApiProperty } from '@nestjs/swagger'

export class HttpExceptionResponseDto {
  @ApiProperty({
    example: 418,
  })
  statusCode: number

  @ApiProperty({
    example: 'Want some tea?',
  })
  message: string
}
