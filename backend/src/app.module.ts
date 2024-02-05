import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { WpsModule } from './wps/wps.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    WpsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
