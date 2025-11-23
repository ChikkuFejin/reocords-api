import { Test, TestingModule } from '@nestjs/testing';
import { DropdownMasterService } from './dropdown-master.service';

describe('DropdownMasterService', () => {
  let service: DropdownMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DropdownMasterService],
    }).compile();

    service = module.get<DropdownMasterService>(DropdownMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
