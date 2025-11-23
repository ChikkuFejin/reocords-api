import { Module } from '@nestjs/common';
import { StandardSectionsService } from './standard-sections.service';
import { StandardSectionsController } from './standard-sections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardSection } from '../../entities/standard-sections';
import { Standard } from '../../entities/standard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandardSection, Standard])],
  controllers: [StandardSectionsController],
  providers: [StandardSectionsService],
  exports: [StandardSectionsService],
})
export class StandardSectionsModule {}

