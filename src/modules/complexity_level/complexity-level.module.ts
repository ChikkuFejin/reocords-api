import { Module } from '@nestjs/common';
import { ComplexityLevelService } from './complexity-level.service';
import { ComplexityLevelController } from './complexity-level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplexityLevel } from '../../entities/complexity-levels.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComplexityLevel])],
  controllers: [ComplexityLevelController],
  providers: [ComplexityLevelService],
})
export class ComplexityLevelModule {}
