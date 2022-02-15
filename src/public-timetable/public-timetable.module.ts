import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Timetable, TimetableSchema } from './schemas/timetable.schema'
import { PublicTimetableService } from './public-timetable.service'
import { PublicTimetableController } from './public-timetable.controller'

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URL ?? 'mongodb://localhost/alt-pja',
    ),
    MongooseModule.forFeature([
      { name: Timetable.name, schema: TimetableSchema },
    ]),
  ],
  providers: [PublicTimetableService],
  controllers: [PublicTimetableController],
})
export class PublicTimetableModule {}
