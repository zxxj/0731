import { Test, TestingModule } from '@nestjs/testing';
import { GenerateFileNoFlatController } from './generate-file-no-flat.controller';

describe('GenerateFileNoFlatController', () => {
  let controller: GenerateFileNoFlatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateFileNoFlatController],
    }).compile();

    controller = module.get<GenerateFileNoFlatController>(GenerateFileNoFlatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
