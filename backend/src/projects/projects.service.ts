import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/projects.schemas';
import { Model } from 'mongoose';
import { WpsService } from 'src/wps/wps.service';
import { Wp } from 'src/wps/schemas/wps.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    private readonly wpsService: WpsService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const ids = [];
    for (const wp of createProjectDto.wps) {
      for (const interval of wp.activeIntervals) {
        if (!this.wpsService.isIntervalValid(interval)) {
          throw new HttpException(
            'Interval is invalid',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      try {
        const newWp = await this.wpsService.create(wp);
        ids.push(newWp);
      } catch (error) {
        throw new HttpException(
          'Work Package with that title already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const createdProject = new this.projectModel({
      ...createProjectDto,
      wps: ids,
    });

    return await createdProject.save();
  }

  findAll() {
    return this.projectModel.find().populate('wps', null, Wp.name).exec();
  }

  findOne(id: string) {
    return this.projectModel.findById(id).populate('wps', null, Wp.name).exec();
  }

  findOneById(id: string) {
    return this.projectModel.findOne({ id: id }).exec();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const oldProject = await this.findOneById(id);

    if (!oldProject) {
      return 'Project not found';
    }

    oldProject.isNew = false;

    if (updateProjectDto.title) {
      oldProject.title = updateProjectDto.title;
    }

    if (updateProjectDto.description) {
      oldProject.description = updateProjectDto.description;
    }

    if (updateProjectDto.interval) {
      oldProject.interval = updateProjectDto.interval;
    }

    if (updateProjectDto.wps && updateProjectDto.wps.length > 0) {
      const ids = [];
      for (const wp of updateProjectDto.wps) {
        if (!wp.activeIntervals) {
          throw new HttpException(
            'No intervals provided',
            HttpStatus.BAD_REQUEST,
          );
        }

        if (!wp.title) {
          throw new HttpException('No title provided', HttpStatus.BAD_REQUEST);
        }

        for (const interval of wp.activeIntervals) {
          if (!this.wpsService.isIntervalValid(interval)) {
            throw new HttpException(
              'Interval format is invalid',
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        try {
          const newWp = await this.wpsService.update(wp.title, wp);
          ids.push(newWp);
        } catch (error) {
          throw new HttpException(
            `Work Package with ${wp.title} title already exists`,
            HttpStatus.CONFLICT,
          );
        }
      }

      oldProject.wps = ids;
    }

    return oldProject.save();
  }

  remove(id: string) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
