import { Module } from '@nestjs/common';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { ProjectsModule } from './projects/projects.module';
import { WpsModule } from './wps/wps.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ProjectsModule,
    WpsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
