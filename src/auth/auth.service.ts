import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service'; // import UserService
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {} // inject here

  login(loginDto: LoginDto, res: Response): Promise<any> {
    return this.userService.login(loginDto, res);
  }
}
