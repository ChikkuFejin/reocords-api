import { Test, TestingModule } from '@nestjs/testing';
import { DropdownMasterController } from './dropdown-master.controller';

describe('DropdownMasterController', () => {
  let controller: DropdownMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropdownMasterController],
    }).compile();

    controller = module.get<DropdownMasterController>(DropdownMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
