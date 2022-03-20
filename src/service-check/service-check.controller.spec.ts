import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCheckController } from './service-check.controller';

describe('ServiceCheckController', () => {
  let controller: ServiceCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceCheckController],
    }).compile();

    controller = module.get<ServiceCheckController>(ServiceCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
