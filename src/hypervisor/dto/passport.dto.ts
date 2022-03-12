import { IsString, IsUUID } from 'class-validator'

export class ScrapperPassportDto {
  @IsString()
  name: string

  @IsUUID()
  uuid: string

  @IsString()
  secret: string
}
