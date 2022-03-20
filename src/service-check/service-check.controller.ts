import { Controller } from '@nestjs/common'
import { ServiceCheckService } from './service-check.service'

@Controller('service-check')
export class ServiceCheckController {
  constructor(private readonly serviceCheck: ServiceCheckService) {}
}
