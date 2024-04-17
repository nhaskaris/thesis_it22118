import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schemas';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { ContractsModule } from 'src/contracts/contracts.module';
import { WpsModule } from 'src/wps/wps.module';
import { HumansModule } from 'src/humans/humans.module';
import { TimesheetsModule } from 'src/timesheets/timesheets.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    ProjectsModule,
    ContractsModule,
    WpsModule,
    HumansModule,
    TimesheetsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
