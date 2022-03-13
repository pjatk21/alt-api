import { ApiProperty } from "@nestjs/swagger";
import { HypervisorScrapperCommands } from "../hypervisor.enum";
import { HypervisorCommandExec } from "../hypervisor.types";

export class HypervisorCommnandRequestDto {
  @ApiProperty()
  scrapper: string

  @ApiProperty({ enum: HypervisorScrapperCommands })
  command: HypervisorScrapperCommands
}
