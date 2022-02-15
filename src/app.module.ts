import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PublicTimetableModule } from './public-timetable/public-timetable.module'

@Module({
  imports: [PublicTimetableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
