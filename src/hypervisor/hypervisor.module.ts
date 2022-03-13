import { Module } from '@nestjs/common'
import { HypervisorGateway } from './hypervisor.gateway'
import { HypervisorController } from './hypervisor.controller'
import { HypervisorService } from './hypervisor.service'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { ScrapperVisa, ScrapperVisaSchema } from './schemas/scrapper-visa.schema'
import { ScrapperState, ScrapperStateSchema } from './schemas/scrapper-state.schema'
import { PublicTimetableModule } from 'src/public-timetable/public-timetable.module'
import { PublicTimetableService } from 'src/public-timetable/public-timetable.service'
import { DispositorService } from './dispositor/dispositor.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature([{ name: ScrapperVisa.name, schema: ScrapperVisaSchema }]),
    MongooseModule.forFeature([
      { name: ScrapperState.name, schema: ScrapperStateSchema },
    ]),
    PublicTimetableModule,
  ],
  providers: [HypervisorGateway, HypervisorService, PublicTimetableService, DispositorService],
  controllers: [HypervisorController],
})
export class HypervisorModule {}
