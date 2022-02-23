import { ApiProperty } from "@nestjs/swagger";
import { GroupDecodedDto } from "./group-decoded.dto";

export class GroupDto {
  @ApiProperty({ required: false })
  decoded?: GroupDecodedDto

  @ApiProperty()
  raw: string
}
