import { Module } from '@nestjs/common';
import { ProductMasterController } from './product-master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionType } from '../../entities/question-type.entity';
import { RouterService } from '../../router.service';

@Module({
  controllers: [ProductMasterController],
  providers: [RouterService],
  imports: [TypeOrmModule.forFeature([QuestionType])],
})
export class ProductMasterModule {}
