import { Test, TestingModule } from '@nestjs/testing';
import { TrscController } from './trsc.controller';

describe('TrscController', () => {
  let controller: TrscController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrscController],
    }).compile();

    controller = module.get<TrscController>(TrscController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
