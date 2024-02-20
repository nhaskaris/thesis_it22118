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
import { InsertUserInfoDto } from './dto/insert-info-user.dto';

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

   // TODO
   update(uid: string, updateUserDto: UpdateUserDto) {
      const updateUser = new this.userModel(updateUserDto);
      return this.userModel.updateOne({ uid }, updateUser);
   }

   remove(uid: string) {
      return this.userModel.deleteOne({ uid }).exec();
   }

   // TODO: Need to check if whatever the user is trying to insert is already in the database or not. Create it or insert id.
   async insertInfo(uid: string, insertUserInfoDto: InsertUserInfoDto) {
      //we need to check if the user has given us a project, human, wp or contract

      const user = await this.userModel.findOne({ uid }).exec();

      if (!user) {
         return;
      }

      if (insertUserInfoDto.projects) {
         user.projects.push(insertUserInfoDto.projects);
      }

      if (insertUserInfoDto.humans) {
         user.humans.push(insertUserInfoDto.humans);
      }

      if (insertUserInfoDto.wps) {
         user.wps.push(insertUserInfoDto.wps);
      }

      if (insertUserInfoDto.contracts) {
         user.contracts.push(insertUserInfoDto.contracts);
      }

      return user.save();
   }
}
