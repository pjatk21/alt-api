import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { HypervisorService } from './hypervisor.service'

@Controller('hypervisor')
@ApiTags('Hypervisor')
export class HypervisorController {
  constructor(private hypervisor: HypervisorService) {}
}
