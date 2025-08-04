import { Test, TestingModule } from '@nestjs/testing';
import { ComplexityLevelsService } from './complexity-levels.service';

describe('ComplexityLevelsService', () => {
  let service: ComplexityLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComplexityLevelsService],
    }).compile();

    service = module.get<ComplexityLevelsService>(ComplexityLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
