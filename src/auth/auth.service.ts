import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../modules/users/user.service'; // import UserService

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {} // inject here

  login(loginDto: LoginDto): Promise<any> {
    return this.userService.login(loginDto);
  }
}
