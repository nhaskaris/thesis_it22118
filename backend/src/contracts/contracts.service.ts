import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './schemas/contracts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel('Contract') private contractModel: Model<Contract>,
  ) {}

  async create(createContractDto: CreateContractDto) {
    const createdContract = new this.contractModel(createContractDto);

    return await createdContract.save();
  }

  async findAll() {
    return await this.contractModel
      .find()
      .populate({
        path: 'project',
        populate: {
          path: 'wps',
        },
      })
      .populate('human')
      .populate('wps')
      .exec();
  }

  findOne(id: string) {
    return `This action returns a #${id} contract`;
  }

  update(updateContractDto: UpdateContractDto) {
    //dto includes id to update with new values

    return this.contractModel.findByIdAndUpdate(
      updateContractDto.id,
      updateContractDto,
      { new: true },
    );
  }

  async remove(id: string) {
    return await this.contractModel.deleteOne({ _id: id }).exec();
  }
}
