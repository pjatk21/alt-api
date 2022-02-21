import { Controller, Get, Render } from '@nestjs/common'
import { PublicTimetableService } from './public-timetable/public-timetable.service'
import { StatsService } from './stats/stats.service'

@Controller()
export class AppController {
  constructor(
    private readonly statsService: StatsService,
    private readonly timetableService: PublicTimetableService,
  ) {}

  @Get()
  @Render('home')
  async getHello() {
    const s = await this.statsService.medianOfResponseTime(3)
    const stats = {
      responseTime: s.meanValue.toFixed(2),
      lastUpdate: await this.timetableService.lastUpdate(),
    }
    return stats
  }
}
