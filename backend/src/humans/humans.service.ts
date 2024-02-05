import { Injectable } from '@nestjs/common';
import { CreateHumanDto } from './dto/create-human.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Humans } from './schemas/humans.schema';

@Injectable()
export class HumansService {
  constructor(@InjectModel('Humans') private humanModel: Model<Humans>) {}

  create(createHumanDto: CreateHumanDto) {
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
}
