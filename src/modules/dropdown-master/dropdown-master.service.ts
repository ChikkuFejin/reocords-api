import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { dropDownMasterDtoScheme } from './dto/dropdown-master-list.dto';
import { validateWithZod } from '../../helpers/zod-validator';
import { serviceResponse } from '../../helpers/response';
import { ModuleRef } from '@nestjs/core';
import { bodyDto, BodyDto } from '../../utils/dto/body.dto';
import { QuestionTypeService } from '../question-type/question-type.service';
import { QuestionTypeResource } from '../question-type/resources/question-type.resource';
import { CategoryService } from '../category/category.service';
import { CategoryResource } from '../category/resources/category.resource';
import { BoardService } from '../boards/board.service';
import { BoardResource } from '../boards/resources/board.resource';
import { QuestionSourceService } from '../question-source/question-source.service';
import { QuestionSourceResource } from '../question-source/resources/question-source.resource';
import { ComplexityLevelService } from '../complexity_level/complexity-level.service';
import { ComplexityLevelResource } from '../complexity_level/resources/complexity-level.resource';

@Injectable()
export class DropdownMasterService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async findAll(data: BodyDto) {
    const validateData = validateWithZod(bodyDto, data);
    const dataType = await this.getAllQuestionTypes(data);
    return serviceResponse.success(dataType);
  }

  async getAllQuestionTypes(payload: BodyDto) {
    const { action, module, data } = payload;
    const mapping = {
      'question-type': {
        service: QuestionTypeService,
        resource: QuestionTypeResource,
      },
      categories: {
        service: CategoryService,
        resource: CategoryResource,
      },
      boards: {
        service: BoardService,
        resource: BoardResource,
      },
      questionSource: {
        service: QuestionSourceService,
        resource: QuestionSourceResource,
      },
      complexityLevel: {
        service: ComplexityLevelService,
        resource: ComplexityLevelResource,
      },
    };

    try {
      let typeData = {};
      const dataTyps = (data?.drop_key ?? []) as string[];
      console.log('typeData', payload);
      for (const type of dataTyps) {
        const serviceName = mapping[type]['service'];
        const resourceName = mapping[type]['resource'];
        const service = await this.moduleRef.get(serviceName, {
          strict: false,
        });

        typeData[type] = await service[action]();
        typeData[type] = resourceName.toCollection(typeData[type]);
      }

      return typeData;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new BadRequestException(
        serviceResponse.failure(
          `Module "${module}" not found or error: ${err.message}`,
        ),
      );
    }
  }
}
