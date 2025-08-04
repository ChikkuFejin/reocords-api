import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionTypeModule } from './modules/question-type/question-type.module';
import { ProductMasterModule } from './modules/product-master/product-master.module';
import { DropdownMasterModule } from './modules/dropdown-master/dropdown-master.module';
import { CategoryModule } from './modules/category/category.module';
import { QuestionSourceModule } from './modules/question-source/question-source.module';
import { ComplexityLevelModule } from './modules/complexity_level/complexity-level.module';
import { BoardModule } from './modules/boards/board.module';
import { QuestionBankModule } from './modules/question-bank/question-bank.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // உங்கள் .env-யில் உள்ள host
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'records_v2',
      autoLoadEntities: true,
      synchronize: false, // production-ல் false வைக்கவும்!
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/Assessment'),
    UserModule,
    AuthModule,
    QuestionTypeModule,
    ProductMasterModule,
    DropdownMasterModule,
    CategoryModule,
    QuestionSourceModule,
    ComplexityLevelModule,
    BoardModule,
    QuestionBankModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
