import { Module } from '@nestjs/common'
import { HypervisorGateway } from './hypervisor.gateway'
import { HypervisorController } from './hypervisor.controller'
import { HypervisorService } from './hypervisor.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { ScrapperVisa, ScrapperVisaSchema } from './schemas/scrapper-visa.schema'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature([{ name: ScrapperVisa.name, schema: ScrapperVisaSchema }]),
  ],
  providers: [HypervisorGateway, HypervisorService],
  controllers: [HypervisorController],
})
export class HypervisorModule {}
