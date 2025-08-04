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
import { TopicsDto, createBoardDtoScheme } from './dto/topics.dto';
import { UpdateBoardDto, updateBoardDtoScheme } from './dto/update-board.dto';
import { serviceResponse } from '../../helpers/response';
import { TopicsResource } from './resources/topics.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { BoardService } from './board.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('board')
export class BoardController {
  constructor(private readonly service: BoardService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createBoardDtoScheme))
  async create(@Body() payload: TopicsDto) {
    const respnonse = await this.service.create(payload);
    return serviceResponse.success(
      TopicsResource.toResponse(respnonse),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(TopicsResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(TopicsResource.toResponse(data));
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateBoardDtoScheme))
  async update(@Param('id') id: number, @Body() payload: UpdateBoardDto) {
    const respnonse = await this.service.update(id, payload);
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
