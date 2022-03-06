import { IsString, IsUUID } from 'class-validator'

export class ScrapperPassportDto {
  @IsString()
  friendlyName: string

  @IsUUID()
  uuid: string

  @IsString()
  presharedKey: string
}
