import { Controller, Get } from '@nestjs/common'
import { PublicTimetableService } from './public-timetable/public-timetable.service'

@Controller()
export class AppController {
  constructor(private readonly timetableService: PublicTimetableService) {}

  @Get('lastUpdate')
  async getHello() {
    const stats = {
      lastScrapperUpload: await this.timetableService.lastUpdate(),
      dataUpTo: await this.timetableService.dataFetchedToDate(),
      count: {
        groups: await this.timetableService
          .listAvailableGroups()
          .then((r) => r.groupsAvailable.length),
        tutors: await this.timetableService
          .listAvailableTutors()
          .then((r) => r.tutorsAvailable.length),
      },
    }
    return stats
  }
}
