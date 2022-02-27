import { Controller, Get, Render } from '@nestjs/common'
import { PublicTimetableService } from './public-timetable/public-timetable.service'

@Controller()
export class AppController {
  constructor(private readonly timetableService: PublicTimetableService) {}

  @Get()
  @Render('home')
  async getHello() {
    const stats = {
      lastUpdate: await this.timetableService.lastUpdate(),
    }
    return stats
  }
}
