import { Test, TestingModule } from '@nestjs/testing';
import { GenerateDemo1Service } from './generate-demo1.service';

describe('GenerateDemo1Service', () => {
  let service: GenerateDemo1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateDemo1Service],
    }).compile();

    service = module.get<GenerateDemo1Service>(GenerateDemo1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
