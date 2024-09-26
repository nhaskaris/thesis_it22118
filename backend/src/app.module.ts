import { Module } from '@nestjs/common';
import { WpsModule } from './wps/wps.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './projects/projects.module';
import { HumansModule } from './humans/humans.module';
import { ContractsModule } from './contracts/contracts.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TimesheetsModule } from './timesheets/timesheets.module';
import { HolidaysModule } from './holidays/holidays.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL as string, {
      dbName: process.env.MONGO_DB_NAME as string,
    }),
    WpsModule,
    ProjectsModule,
    HumansModule,
    ContractsModule,
    UsersModule,
    AuthModule,
    TimesheetsModule,
    HolidaysModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
