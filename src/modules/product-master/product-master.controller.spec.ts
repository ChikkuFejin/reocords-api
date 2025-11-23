import { Test, TestingModule } from '@nestjs/testing';
import { ProductMasterController } from './product-master.controller';

describe('ProductMasterController', () => {
  let controller: ProductMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductMasterController],
    }).compile();

    controller = module.get<ProductMasterController>(ProductMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
