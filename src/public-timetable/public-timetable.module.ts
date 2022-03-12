import { CacheModule, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Timetable, TimetableSchema } from './schemas/timetable.schema'
import { PublicTimetableService } from './public-timetable.service'
import { PublicTimetableController } from './public-timetable.controller'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Timetable.name, schema: TimetableSchema }]),
    CacheModule.register({ ttl: 60 * 5 }), // 5 minutes
    ThrottlerModule.forRoot({ ttl: 600, limit: 1200 }), // 2 requests per second
  ],
  providers: [
    PublicTimetableService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [PublicTimetableController],
  exports: [
    MongooseModule.forFeature([{ name: Timetable.name, schema: TimetableSchema }]),
  ],
})
export class PublicTimetableModule {}
