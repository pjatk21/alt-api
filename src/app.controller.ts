import { Controller, Get } from '@nestjs/common'
import { PublicTimetableService } from './public-timetable/public-timetable.service'

@Controller()
export class AppController {
  constructor(private readonly timetableService: PublicTimetableService) {}

  @Get('lastUpdate')
  async getHello() {
    const stats = {
      lastUpdate: await this.timetableService.lastUpdate(),
      groupsOnBoard: await this.timetableService
        .listAvailableGroups()
        .then((r) => r.groupsAvailable.length),
      tutorsOnBoard: await this.timetableService
        .listAvailableTutors()
        .then((r) => r.tutorsAvailable.length),
      lastEntries: await this.timetableService.dataFetchedToDate(),
    }
    return stats
  }
}
