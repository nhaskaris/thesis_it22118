import { Test, TestingModule } from '@nestjs/testing';
import { HumansController } from './humans.controller';
import { HumansService } from './humans.service';

describe('HumansController', () => {
  let controller: HumansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HumansController],
      providers: [HumansService],
    }).compile();

    controller = module.get<HumansController>(HumansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
