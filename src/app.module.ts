import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { StatsInterceptor } from './stats/stats.interceptor'
import { StatsModule } from './stats/stats.module'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { StatsService } from './stats/stats.service'
import { PublicTimetableService } from './public-timetable/public-timetable.service'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    PublicTimetableModule,
    StatsModule,
    ThrottlerModule.forRoot({ ttl: 300, limit: 100 }),
  ],
  controllers: [AppController],
  providers: [
    StatsService,
    PublicTimetableService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StatsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
