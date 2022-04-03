import { CacheModule, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Timetable, TimetableSchema } from './schemas/timetable.schema'
import { PublicTimetableService } from './public-timetable.service'
import { PublicTimetableController } from './public-timetable.controller'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { CalendarService } from './calendar/calendar.service'
import { PostOfficeService } from './post-office/post-office.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Timetable.name, schema: TimetableSchema }]),
    CacheModule.register({ ttl: 60 * 5 }), // 5 minutes
    ThrottlerModule.forRoot({ ttl: 600, limit: 1200 }), // 2 requests per second
  ],
  providers: [
    CalendarService,
    PostOfficeService,
    PublicTimetableService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [PublicTimetableController],
  exports: [
    MongooseModule.forFeature([{ name: Timetable.name, schema: TimetableSchema }]),
    CalendarService,
    PostOfficeService,
  ],
})
export class PublicTimetableModule {}
