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
import { CreateBoardDto, createBoardDtoScheme } from './dto/create-board.dto';
import { UpdateBoardDto, updateBoardDtoScheme } from './dto/update-board.dto';
import { serviceResponse } from '../../helpers/response';
import { BoardResource } from './resources/board.resource';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { BoardService } from './board.service';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';

@Controller('board')
export class BoardController {
  constructor(private readonly service: BoardService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createBoardDtoScheme))
  async create(@Body() payload: CreateBoardDto) {
    const respnonse = await this.service.create(payload);
    return serviceResponse.success(
      BoardResource.toResponse(respnonse),
      HttpResponseMessages.CREATED,
    );
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return serviceResponse.success(BoardResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(BoardResource.toResponse(data));
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
