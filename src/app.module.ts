import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { PublicTimetableService } from './public-timetable/public-timetable.service'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { HypervisorModule } from './hypervisor/hypervisor.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ServiceCheckModule } from './service-check/service-check.module';
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost/altapi'),
    PublicTimetableModule,
    HypervisorModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'alt-api-ui', 'dist'),
    }),
    ServiceCheckModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [PublicTimetableService],
})
export class AppModule {}
