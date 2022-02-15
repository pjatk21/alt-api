import { Test, TestingModule } from '@nestjs/testing'
import { PublicTimetableService } from './public-timetable.service'

describe('PublicTimetableService', () => {
  let service: PublicTimetableService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicTimetableService],
    }).compile()

    service = module.get<PublicTimetableService>(PublicTimetableService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
