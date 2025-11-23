import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { QuestionTypeModule } from './modules/question-type/question-type.module';
import { ProductMasterModule } from './modules/product-master/product-master.module';
import { DropdownMasterModule } from './modules/dropdown-master/dropdown-master.module';
import { CategoryModule } from './modules/category/category.module';
import { QuestionSourceModule } from './modules/question-source/question-source.module';
import { ComplexityLevelModule } from './modules/complexity_level/complexity-level.module';
import { BoardModule } from './modules/boards/board.module';
import { QuestionBankModule } from './modules/question-bank/question-bank.module';
import { TopicModule } from './modules/topics/topic.module';
import { AssessmentModule } from './modules/assessments/assessment.module';
import { StandardsModule } from './modules/standards/standards.module';
import { StandardSectionsModule } from './modules/standard-sections/standard-sections.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { ParticipantsModule } from './modules/participants/participants.module';
import { MentorsModule } from './modules/mentors/mentors.module';
import { UserContextMiddleware } from './middleware/user-context.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // உங்கள் .env-யில் உள்ள host
      port: 3306,
      username: 'root',
      password: '',
      database: 'records',
      autoLoadEntities: true,
      synchronize: false, // production-ல் false வைக்கவும்!
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/Assessment'),
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
    TopicModule,
    AssessmentModule,
    StandardsModule,
    StandardSectionsModule,
    InstitutionModule,
    ParticipantsModule,
    MentorsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserContextMiddleware).forRoutes('*');
  }
}
