import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/projects.schemas';
import { Model } from 'mongoose';
import { WpsService } from 'src/wps/wps.service';
import { Wps } from 'src/wps/schemas/wps.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    private readonly wpsService: WpsService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const ids = [];
    for (const wp of createProjectDto.wps) {
      ids.push(await this.wpsService.create(wp));
    }

    const createdProject = new this.projectModel({
      ...createProjectDto,
      wps: ids,
    });

    return createdProject.save();
  }

  findAll() {
    return this.projectModel.find().populate('wps', null, Wps.name).exec();
  }

  findOne(id: string) {
    return this.projectModel
      .findById(id)
      .populate('wps', null, Wps.name)
      .exec();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const oldProject = await this.findOne(id);

    if (!oldProject) {
      return 'Project not found';
    }

    oldProject.interval = updateProjectDto.changedActiveInterval;

    return oldProject.save();
  }

  remove(id: string) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
