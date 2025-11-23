import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../modules/users/user.module'; // import UserModule
import { RouterService } from '../router.service';

@Module({
  imports: [UserModule], // add here
  providers: [AuthService, RouterService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
