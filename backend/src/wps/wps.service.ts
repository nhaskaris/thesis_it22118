import { Injectable } from '@nestjs/common';
import { CreateWpDto } from './dto/create-wp.dto';
import { UpdateWpDto } from './dto/update-wp.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Wp } from './schemas/wps.schema';
import { Interval } from 'src/types/interval';

@Injectable()
export class WpsService {
  constructor(@InjectModel('Wp') private wpModel: Model<Wp>) {}

  create(createWpDto: CreateWpDto): Promise<Wp> {
    const createdWp = new this.wpModel(createWpDto);
    return createdWp.save();
  }

  findAll(): Promise<Wp[]> {
    return this.wpModel.find().exec();
  }

  findOne(id: string): Promise<any> {
    return this.wpModel.findById(id).exec();
  }

  findOneByTitle(title: string) {
    return this.wpModel
      .findOne({
        title: title,
      })
      .exec();
  }

  deleteAll(): Promise<any> {
    return this.wpModel.deleteMany({}).exec();
  }

  async update(title: string, updateWpDto: UpdateWpDto): Promise<Wp> {
    //get old wp and push new interval
    const oldWp = await this.findOneByTitle(title);

    if (!oldWp) {
      throw new Error('WP not found');
    }

    oldWp.isNew = false;

    if (updateWpDto.title == oldWp.title) {
      throw new Error(`Title ${updateWpDto} already exists`);
    }

    const newIntervals = updateWpDto.newActiveIntervals;
    oldWp.activeIntervals = [];
    for (const newInterval of newIntervals) {
      if (this.isIntervalValid(newInterval)) {
        oldWp.activeIntervals.push(newInterval);
      }
    }

    //update wp
    return await oldWp.save();
  }

  async remove(id: string) {
    return await this.wpModel.findByIdAndDelete(id).exec();
  }

  isIntervalValid(interval: Interval): boolean {
    if (interval.startDate.length != 3 || interval.endDate.length != 3) {
      return false;
    }

    if (interval.startDate[0] != 'M' || interval.endDate[0] != 'M') {
      return false;
    }

    if (
      isNaN(Number(interval.startDate[1])) ||
      isNaN(Number(interval.startDate[2])) ||
      isNaN(Number(interval.endDate[1])) ||
      isNaN(Number(interval.endDate[2]))
    ) {
      return false;
    }

    if (
      Number(interval.startDate[2]) > Number(interval.endDate[2]) ||
      (Number(interval.startDate[2]) == Number(interval.endDate[2]) &&
        Number(interval.startDate[1]) > Number(interval.endDate[1]))
    ) {
      return false;
    }

    return true;
  }
}
