import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { serviceResponse } from '../../helpers/response';
import { HttpResponseMessages } from '../../constants/http-response-messages';
import { ZodValidationPipe } from '../../utils/pipes/zodValidation.pipe';
import {
  CreateUserDto,
  UpdateUserDto,
  createUserDtoScheme,
} from './dto/user.dto';
import { UserResource } from './resources/user.resource';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return serviceResponse.success(UserResource.toCollection(data));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(Number(id));
    if (!data) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    return serviceResponse.success(UserResource.toResponse(data));
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(createUserDtoScheme)) payload: CreateUserDto,
  ) {
    const created = await this.userService.create(payload as Partial<User>);
    return serviceResponse.success(
      UserResource.toResponse(created),
      HttpResponseMessages.CREATED,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createUserDtoScheme)) payload: UpdateUserDto,
  ) {
    const existing = await this.userService.findOne(Number(id));
    if (!existing) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }
    // Omit id and strip nulls to align with Partial<User>
    const sanitized = Object.fromEntries(
      Object.entries(payload as Record<string, unknown>).filter(
        ([key, v]) => key !== 'id' && v !== null,
      ),
    );
    const updated = await this.userService.update(
      Number(id),
      sanitized as Partial<User>,
    );
    let message = HttpResponseMessages.UPDATED;
    if (!updated?.affected) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.userService.remove(Number(id));
    let message = HttpResponseMessages.DELETED;
    if (!result?.affected && result !== undefined) {
      message = HttpResponseMessages.RESOURCE_NOT_AFFECTED;
    }
    return serviceResponse.success(null, message);
  }
}
