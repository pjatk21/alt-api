import { Module } from '@nestjs/common'
import { ServiceCheckService } from './service-check.service'
import { ServiceCheckController } from './service-check.controller'
import {
  ServiceCheckStatus,
  ServiceCheckStatusSchema,
} from './schemas/service-check.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceCheckStatus.name, schema: ServiceCheckStatusSchema },
    ]),
  ],
  providers: [ServiceCheckService],
  controllers: [ServiceCheckController],
})
export class ServiceCheckModule {}
