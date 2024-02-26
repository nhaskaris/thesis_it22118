import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './schemas/contracts.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectsService } from 'src/projects/projects.service';
import { WpsService } from 'src/wps/wps.service';

@Injectable()
export class ContractsService {
   constructor(
      @InjectModel('Contract') private contractModel: Model<Contract>,
      private readonly projectsService: ProjectsService,
      private readonly wpsService: WpsService,
   ) {}

   async create(createContractDto: CreateContractDto) {
      const ids = [];
      for (const wp of createContractDto.wps) {
         ids.push(await this.wpsService.create(wp));
      }

      const createdContract = new this.contractModel({
         ...createContractDto,
         wps: ids,
      });

      return createdContract.save();
   }

   async findAll() {
      return await this.contractModel.find().exec();
   }

   findOne(id: string) {
      return `This action returns a #${id} contract`;
   }

   update(id: string, updateContractDto: UpdateContractDto) {
      return `This action updates a #${id} contract`;
   }

   remove(id: string) {
      return `This action removes a #${id} contract`;
   }
}
