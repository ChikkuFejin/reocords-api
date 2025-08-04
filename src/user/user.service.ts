import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoginDto, loginDtoScheme } from 'src/auth/dto/login.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { validateWithZod } from '../helpers/zod-validator';
import { serviceResponse } from '../helpers/response';
import { generateToken } from '../helpers/jwt.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async login(loginDto: LoginDto, res: Response) {
    const validateData = validateWithZod(loginDtoScheme, loginDto);

    const user = await this.userRepository.findOneBy({
      email: validateData.user_name,
    });
    if (!user) {
      throw new BadRequestException(serviceResponse.notFoundError());
    }

    if (!(await bcrypt.compare(validateData.password, user.password_hash))) {
      throw new BadRequestException(serviceResponse.unAuthorizedError());
    }
    const token = generateToken({ userId: user.id });
    return serviceResponse.success({ token },'Login successful. Welcome back!');
  }
}
