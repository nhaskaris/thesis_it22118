import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schemas';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Project } from 'src/projects/schemas/projects.schemas';
import { Human } from 'src/humans/schemas/humans.schema';
import { Wp } from 'src/wps/schemas/wps.schema';
import { Contract } from 'src/contracts/schemas/contracts.schema';

@Injectable()
export class UsersService {
   constructor(
      @InjectModel('User') private userModel: Model<User>,
      private authService: AuthService,
   ) {}

   async create(createUserDto: CreateUserDto) {
      const createdUser = new this.userModel(createUserDto);

      const user = await this.authService.firebaseApp
         .auth()
         .createUser({
            email: createUserDto.email,
            emailVerified: false,
            password: createUserDto.password,
            disabled: false,
            displayName: '',
         })
         .catch((error) => {
            if (error.code === 'auth/email-already-exists') {
               return this.authService.firebaseApp
                  .auth()
                  .getUserByEmail(createUserDto.email);
            }
         });

      if (!user) {
         return;
      }

      createdUser.uid = user.uid;

      return createdUser.save();
   }

   async findAll() {
      return await this.userModel.find().exec();
   }

   async findOne(uid: string) {
      return await this.userModel
         .findOne({ uid })
         .populate('projects', null, Project.name)
         .populate('humans', null, Human.name)
         .populate('wps', null, Wp.name)
         .populate('contracts', null, Contract.name)
         .exec();
   }

   update(uid: string, updateUserDto: UpdateUserDto) {
      return `This action updates a #${uid} user with ${JSON.stringify(
         updateUserDto,
      )}`;
   }

   remove(uid: string) {
      return this.userModel.deleteOne({ uid }).exec();
   }
}
