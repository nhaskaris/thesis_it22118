import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schemas';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Human } from 'src/humans/schemas/humans.schema';
import { Wp } from 'src/wps/schemas/wps.schema';
import { Contract } from 'src/contracts/schemas/contracts.schema';
import { InsertUserInfoDto } from './dto/insert-info-user.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { HumansService } from 'src/humans/humans.service';
import { ContractsService } from 'src/contracts/contracts.service';
import { WpsService } from 'src/wps/wps.service';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
   constructor(
      @InjectModel('User') private userModel: Model<User>,
      private authService: AuthService,
      private projectsService: ProjectsService,
      private humansService: HumansService,
      private contractsService: ContractsService,
      private wpsService: WpsService,
   ) {}

   async create(createUserDto: CreateUserDto) {
      const createdUser = new this.userModel(createUserDto);

      const generatePassword = (
         length = 30,
         characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@',
      ) =>
         Array.from(crypto.randomFillSync(new Uint32Array(length)))
            .map((x) => characters[x % characters.length])
            .join('');

      const password = generatePassword();

      const user = await this.authService.firebaseApp
         .auth()
         .createUser({
            email: createUserDto.email,
            emailVerified: false,
            password: password,
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

      this.authService.firebaseApp.auth().setCustomUserClaims(user.uid, {
         admin: createUserDto.role == 'admin',
      });

      createdUser.uid = user.uid;

      return createdUser.save();
   }

   async findAll(uid: string) {
      const users = await this.userModel.find().exec();

      //remove the user with the uid given
      const filteredUsers = users.filter((user) => user.uid !== uid);

      return filteredUsers;
   }

   async findOne(uid: string) {
      return await this.userModel
         .findOne({ uid })
         .populate({
            path: 'projects',
            populate: {
               path: 'wps',
               model: Wp.name,
            },
         })
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

   async remove(_id: string) {
      return await this.userModel.deleteOne({ _id }).exec();
   }

   async insertInfo(uid: string, insertUserInfoDto: InsertUserInfoDto) {
      const user = await this.userModel.findOne({ uid }).exec();

      if (!user) {
         return;
      }

      if (insertUserInfoDto.project) {
         const newProject = await this.projectsService.create(
            insertUserInfoDto.project,
         );

         user.projects.push(newProject);
      }

      if (insertUserInfoDto.human) {
         const newHuman = await this.humansService.create(
            insertUserInfoDto.human,
         );
         user.humans.push(newHuman);
      }

      if (insertUserInfoDto.wp) {
         const newWp = await this.wpsService.create(insertUserInfoDto.wp);

         user.wps.push(newWp);
      }

      if (insertUserInfoDto.contract) {
         const newContract = await this.contractsService.create(
            insertUserInfoDto.contract,
         );

         user.contracts.push(newContract);
      }

      return user.save();
   }
}
