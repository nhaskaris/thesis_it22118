import { Injectable } from '@nestjs/common';
import { CreateWpDto } from './dto/create-wp.dto';
import { UpdateWpDto } from './dto/update-wp.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Wp } from './schemas/wps.schema';

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

   findOneByTitle(title: string): Promise<any> {
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
         //check if new interval is valid
         if (newInterval.startDate > newInterval.endDate) {
            throw new Error('Start date must be before end date');
         }

         oldWp.activeIntervals.push(newInterval);
      }

      //update wp
      return await oldWp.save();
   }

   async remove(id: string) {
      return await this.wpModel.findByIdAndDelete(id).exec();
   }
}
