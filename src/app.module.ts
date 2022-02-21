import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { StatsInterceptor } from './stats/stats.interceptor'
import { StatsModule } from './stats/stats.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { StatsService } from './stats/stats.service'
import { PublicTimetableService } from './public-timetable/public-timetable.service'

@Module({
  imports: [PublicTimetableModule, StatsModule],
  controllers: [AppController],
  providers: [
    StatsService,
    PublicTimetableService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StatsInterceptor,
    },
  ],
})
export class AppModule {}
