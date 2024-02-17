import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema, Project } from './schemas/projects.schemas';
import { WpsModule } from 'src/wps/wps.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    WpsModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
