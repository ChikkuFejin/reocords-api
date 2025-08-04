import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException, UsePipes,
} from '@nestjs/common';
import { QuestionTypeService } from './question-type.service';
import {
  CreateQuestionTypeDto,
  createQuestionTypeDtoScheme,
} from './dto/create-question-type.dto';
import {
  UpdateQuestionTypeDto,
  updateQuestionTypeDtoScheme,
} from './dto/update-question-type.dto';
import { serviceResponse } from '../../helpers/response';
import { QuestionTypeResource } from './resources/question-type.resource';;
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';


@Controller('question-type')
export class QuestionTypeController {
  constructor(private readonly questionTypeService: QuestionTypeService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionTypeDtoScheme))
  async create(@Body() createQuestionTypeDto: CreateQuestionTypeDto) {
    const respnonse = await this.questionTypeService.create(
      createQuestionTypeDto,
    );
    return serviceResponse.success(
      QuestionTypeResource.toResponse(respnonse),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.questionTypeService.findAll();
    return serviceResponse.success(QuestionTypeResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.questionTypeService.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(QuestionTypeResource.toResponse(data));
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateQuestionTypeDtoScheme))
  async update(
    @Param('id') id: number,
    @Body() updateQuestionTypeDto: UpdateQuestionTypeDto,
  ) {
    const respnonse = await this.questionTypeService.update(
      id,
      updateQuestionTypeDto,
    );
    let message = HttpResponseMessages.UPDATED;
    if (!respnonse?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.questionTypeService.remove(id);
    let message = HttpResponseMessages.DELETED;
    if (!data?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }
}
