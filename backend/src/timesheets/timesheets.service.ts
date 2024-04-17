import { Injectable } from '@nestjs/common';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Timesheet } from './schemas/timesheets.schemas';
import { Model } from 'mongoose';

@Injectable()
export class TimesheetsService {
  constructor(
    @InjectModel('Timesheet') private timesheetModel: Model<Timesheet>,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto) {
    return await this.timesheetModel.create(createTimesheetDto);
  }

  async findAll() {
    return await this.timesheetModel
      .find()
      .populate('project')
      .populate('human')
      .populate('wp')
      .exec();
  }

  async findOne(id: string) {
    return await this.timesheetModel.findById(id).exec;
  }

  update(id: string, updateTimesheetDto: UpdateTimesheetDto) {
    return `This action updates a #${updateTimesheetDto} timesheet`;
  }

  async remove(id: string) {
    return await this.timesheetModel.findByIdAndDelete(id).exec();
  }
}
