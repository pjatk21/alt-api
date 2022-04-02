import { Test, TestingModule } from '@nestjs/testing'
import { PostOfficeService } from './post-office.service'

describe('PostOfficeService', () => {
  let service: PostOfficeService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostOfficeService],
    }).compile()

    service = module.get<PostOfficeService>(PostOfficeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
