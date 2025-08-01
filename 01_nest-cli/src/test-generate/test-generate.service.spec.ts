import { Test, TestingModule } from '@nestjs/testing';
import { TestGenerateService } from './test-generate.service';

describe('TestGenerateService', () => {
  let service: TestGenerateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestGenerateService],
    }).compile();

    service = module.get<TestGenerateService>(TestGenerateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
