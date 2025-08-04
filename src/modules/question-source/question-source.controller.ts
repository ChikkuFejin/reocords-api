import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post, UsePipes,
} from '@nestjs/common';
import {
  CreateQuestionSourceDto,
  createQuestionSourceDtoScheme,
} from './dto/create-question-source.dto';
import {
  UpdateQuestionSourceDto,
  updateQuestionSourceDtoScheme,
} from './dto/update-question-source.dto';
import { serviceResponse } from '../../helpers/response';
import { QuestionSourceResource } from './resources/question-source.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { QuestionSourceService } from './question-source.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('question-source')
export class QuestionSourceController {
  constructor(private readonly service: QuestionSourceService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createQuestionSourceDtoScheme))
  async create(@Body() createQuestionTypeDto: CreateQuestionSourceDto) {
    const respnonse = await this.service.create(createQuestionTypeDto);
    return serviceResponse.success(
      QuestionSourceResource.toResponse(respnonse),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(QuestionSourceResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(QuestionSourceResource.toResponse(data));
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateQuestionSourceDtoScheme))
  async update(
    @Param('id') id: number,
    @Body() updateQuestionTypeDto: UpdateQuestionSourceDto,
  ) {
    const respnonse = await this.service.update(id, updateQuestionTypeDto);
    let message = HttpResponseMessages.UPDATED;
    if (!respnonse?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const data = await this.service.remove(id);
    let message = HttpResponseMessages.DELETED;
    if (!data?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }
}
