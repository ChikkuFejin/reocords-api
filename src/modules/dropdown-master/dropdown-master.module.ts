import { Module } from '@nestjs/common';
import { DropdownMasterController } from './dropdown-master.controller';
import { RouterService } from '../../router.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionType } from '../../entities/question-type.entity';
import { DropdownMasterService } from './dropdown-master.service';
import { QuestionTypeService } from '../question-type/question-type.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../../entities/category.entity';
import { QuestionSource } from '../../entities/question-source.entity';
import { ComplexityLevel } from '../../entities/complexity-levels.entity';
import { QuestionSourceService } from '../question-source/question-source.service';
import { ComplexityLevelService } from '../complexity_level/complexity-level.service';
import { Board } from '../../entities/boards.entity';
import { BoardService } from '../boards/board.service';
import { StandardsService } from '../standards/standards.service';
import { Standard } from '../../entities/standard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionType,
      Category,
      QuestionSource,
      ComplexityLevel,
      Board,
      Standard
    ]),
  ],
  providers: [
    RouterService,
    DropdownMasterService,
    QuestionTypeService,
    CategoryService,
    QuestionSourceService,
    ComplexityLevelService,
    BoardService,
    StandardsService,
  ],
  controllers: [DropdownMasterController],
})
export class DropdownMasterModule {}
