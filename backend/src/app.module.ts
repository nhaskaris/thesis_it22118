import { Module } from '@nestjs/common';
import { WpsModule } from './wps/wps.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './projects/projects.module';
import { HumansModule } from './humans/humans.module';
import { ContractsModule } from './contracts/contracts.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
   imports: [
      MongooseModule.forRoot('mongodb://localhost:27017/nest'),
      WpsModule,
      ProjectsModule,
      HumansModule,
      ContractsModule,
      ConfigModule.forRoot(),
      UsersModule,
      AuthModule,
   ],
})
export class AppModule {}
