import { Test, TestingModule } from '@nestjs/testing';
import { TestGenerateController } from './test-generate.controller';

describe('TestGenerateController', () => {
  let controller: TestGenerateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestGenerateController],
    }).compile();

    controller = module.get<TestGenerateController>(TestGenerateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
