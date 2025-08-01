import { Test, TestingModule } from '@nestjs/testing';
import { GenerateDemo1Controller } from './generate-demo1.controller';
import { GenerateDemo1Service } from './generate-demo1.service';

describe('GenerateDemo1Controller', () => {
  let controller: GenerateDemo1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerateDemo1Controller],
      providers: [GenerateDemo1Service],
    }).compile();

    controller = module.get<GenerateDemo1Controller>(GenerateDemo1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
