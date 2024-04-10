import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHumanDto } from './dto/create-human.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Human } from './schemas/humans.schema';

@Injectable()
export class HumansService {
   constructor(@InjectModel('Human') private humanModel: Model<Human>) {}

   async create(createHumanDto: CreateHumanDto) {
      const existingHuman = await this.humanModel
         .findOne({ vat: createHumanDto.vat })
         .exec();

      if (existingHuman) {
         return existingHuman;
      }

      const createdHuman = new this.humanModel(createHumanDto);

      return createdHuman.save();
   }

   findAll() {
      return this.humanModel.find().exec();
   }

   findOne(id: string) {
      return this.humanModel.findById(id).exec();
   }

   remove(id: string) {
      return this.humanModel.findByIdAndDelete(id).exec();
   }

   deleteAll() {
      return this.humanModel.deleteMany({}).exec();
   }

   async update(vat: string, createHumanDto: CreateHumanDto) {
      const existingHuman = await this.humanModel
         .findOne({ vat: createHumanDto.vat })
         .exec();

      if (existingHuman) {
         throw new HttpException(
            'Human with that VAT already exists',
            HttpStatus.CONFLICT,
         );
      }

      return this.humanModel
         .findOneAndUpdate({ vat }, createHumanDto, { new: true })
         .exec();
   }
}
