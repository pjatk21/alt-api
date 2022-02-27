import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'
import { APP_GUARD } from '@nestjs/core'
import { PublicTimetableService } from './public-timetable/public-timetable.service'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [PublicTimetableModule, ThrottlerModule.forRoot({ ttl: 300, limit: 1000 })],
  controllers: [AppController],
  providers: [
    PublicTimetableService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
