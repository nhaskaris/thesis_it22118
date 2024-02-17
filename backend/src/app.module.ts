import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { WpsModule } from './wps/wps.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './projects/projects.module';
import { HumansModule } from './humans/humans.module';
import { ContractsModule } from './contracts/contracts.module';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { AuthMiddleware } from './auth/auth.middleware';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    WpsModule,
    ProjectsModule,
    HumansModule,
    ContractsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useValue: AuthGuard }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
