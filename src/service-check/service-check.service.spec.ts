import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCheckService } from './service-check.service';

describe('ServiceCheckService', () => {
  let service: ServiceCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceCheckService],
    }).compile();

    service = module.get<ServiceCheckService>(ServiceCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
