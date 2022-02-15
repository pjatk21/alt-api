import { Test, TestingModule } from '@nestjs/testing'
import { PublicTimetableController } from './public-timetable.controller'

describe('PublicTimetableController', () => {
  let controller: PublicTimetableController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicTimetableController],
    }).compile()

    controller = module.get<PublicTimetableController>(PublicTimetableController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
