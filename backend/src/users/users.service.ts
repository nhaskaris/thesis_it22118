import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schemas';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Human } from 'src/humans/schemas/humans.schema';
import { Wp } from 'src/wps/schemas/wps.schema';
import { InsertUserInfoDto } from './dto/insert-info-user.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { HumansService } from 'src/humans/humans.service';
import { ContractsService } from 'src/contracts/contracts.service';
import { WpsService } from 'src/wps/wps.service';
import * as crypto from 'crypto';
import { InfoAdmin } from 'src/types/userAuthInfoRequest';
import { TimesheetsService } from 'src/timesheets/timesheets.service';
import { LinkUserDto } from './dto/link-user.dto';
import { CreateContractDto } from 'src/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/contracts/dto/update-contract.dto';
import { UpdateTimesheetDto } from 'src/timesheets/dto/update-timesheet.dto';
import { CreateTimesheetDto } from 'src/timesheets/dto/create-timesheet.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private authService: AuthService,
    private projectsService: ProjectsService,
    private humansService: HumansService,
    private contractsService: ContractsService,
    private wpsService: WpsService,
    private timesheetsService: TimesheetsService,
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

    const userExists = await this.userModel.findOne({ uid: user.uid }).exec();
    if (userExists) {
      return userExists;
    }

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
      .populate({
        path: 'contracts',
        populate: [
          {
            path: 'project',
            model: 'Project',
            populate: {
              path: 'wps',
              model: Wp.name,
            },
          },
          {
            path: 'human',
            model: 'Human',
          },
          {
            path: 'wps',
            model: 'Wp',
          },
        ],
      })
      .populate({
        path: 'timesheets',
        populate: [
          {
            path: 'contract',
            model: 'Contract',
            populate: [
              {
                path: 'project',
                model: 'Project',
              },
              {
                path: 'human',
                model: 'Human',
              },
              {
                path: 'wps',
                model: 'Wp',
              },
            ],
          },
        ],
      })
      .exec();
  }

  update(uid: string, updateUserDto: UpdateUserDto) {
    const updateUser = new this.userModel(updateUserDto);
    return this.userModel.updateOne({ uid }, updateUser);
  }

  async remove(_id: string) {
    const user = await this.userModel.findOne({ _id }).exec();

    if (!user) {
      return;
    }

    await this.authService.firebaseApp.auth().deleteUser(user.uid);

    for (const project of user.projects) {
      await this.projectsService.remove(String(project));
    }

    for (const contract of user.contracts) {
      await this.contractsService.remove(String(contract));
    }

    for (const timesheet of user.timesheets) {
      await this.timesheetsService.remove(String(timesheet));
    }

    return await this.userModel.deleteOne({ _id }).exec();
  }

  async insertInfo(uid: string, insertUserInfoDto: InsertUserInfoDto) {
    const user = await this.userModel.findOne({ uid }).exec();

    if (!user) {
      return;
    }

    user.isNew = false;

    if (insertUserInfoDto.project) {
      if (
        await this.projectsService.findOneById(insertUserInfoDto.project.id)
      ) {
        throw new HttpException('Project already exists', HttpStatus.CONFLICT);
      }

      const newProject = await this.projectsService.create(
        insertUserInfoDto.project,
      );

      user.projects.push(newProject);
    }

    if (insertUserInfoDto.human) {
      const newHuman = await this.humansService.create(insertUserInfoDto.human);
      user.humans.push(newHuman);
    }

    if (insertUserInfoDto.contract) {
      const newContract = await this.contractsService.create(
        insertUserInfoDto.contract as CreateContractDto,
      );

      user.contracts.push(newContract);
    }

    if (insertUserInfoDto.timesheet) {
      const newTimesheet = await this.timesheetsService.create(
        insertUserInfoDto.timesheet as CreateTimesheetDto,
      );

      user.timesheets.push(newTimesheet);
    }

    return user.save();
  }

  async updateInfo(updateUserInfoDto: InsertUserInfoDto) {
    if (updateUserInfoDto.project) {
      await this.projectsService.update(
        updateUserInfoDto.project.id,
        updateUserInfoDto.project,
      );
    }

    if (updateUserInfoDto.human) {
      await this.humansService.update(
        updateUserInfoDto.oldHuman!.vat,
        updateUserInfoDto.human,
      );
    }

    if (updateUserInfoDto.contract) {
      await this.contractsService.update(
        updateUserInfoDto.contract as UpdateContractDto,
      );
    }

    if (updateUserInfoDto.timesheet) {
      await this.timesheetsService.update(
        updateUserInfoDto.timesheet as UpdateTimesheetDto,
      );
    }
  }

  async getAllInfo() {
    const info: InfoAdmin = {
      projects: [],
      contracts: [],
      humans: [],
      wps: [],
      timesheets: [],
    };

    info.projects = await this.projectsService.findAll();
    info.contracts = await this.contractsService.findAll();
    info.humans = await this.humansService.findAll();
    info.timesheets = await this.timesheetsService.findAll();
    info.wps = await this.wpsService.findAll();

    return info;
  }

  async linkUser(uid: string, linkUserDto: LinkUserDto) {
    const email = linkUserDto.email.toLowerCase();
    //create user with new email and link it to the user with the uid given. Then make sure the new user is linked with all the other users linked to the user with the uid given. First import to the new user the other users and finally add to the other users the new user.
    const newUser = await this.create({ email, role: 'user' });

    if (!newUser) {
      return;
    }

    const oldUser = await this.userModel.findOne({ uid }).exec();

    if (!oldUser) {
      return;
    }

    newUser.linked_users.push(oldUser);

    for (const linkedUser of oldUser.linked_users) {
      newUser.linked_users.push(linkedUser);
    }

    for (const linkedUser of oldUser.linked_users) {
      const user = await this.userModel.findOne({ _id: linkedUser }).exec();

      if (!user) {
        return;
      }

      user.linked_users.push(newUser);

      await user.updateOne(user);
    }

    oldUser.linked_users.push(newUser);

    await oldUser.updateOne(oldUser);

    return newUser.updateOne(newUser);
  }

  async getAllInfoLinkedUsers(user: User) {
    for (const linkedUser of user.linked_users) {
      const linked_user = await this.userModel
        .findOne({ _id: linkedUser })
        .populate({
          path: 'projects',
          populate: {
            path: 'wps',
            model: Wp.name,
          },
        })
        .populate('humans', null, Human.name)
        .populate({
          path: 'contracts',
          populate: [
            {
              path: 'project',
              model: 'Project',
            },
            {
              path: 'human',
              model: 'Human',
            },
            {
              path: 'wps',
              model: 'Wp',
            },
          ],
        })
        .populate({
          path: 'timesheets',
          populate: [
            {
              path: 'project',
              model: 'Project',
            },
            {
              path: 'human',
              model: 'Human',
            },
            {
              path: 'wp',
              model: 'Wp',
            },
          ],
        })
        .exec();

      if (!linked_user) {
        return;
      }

      for (const human of linked_user.humans) {
        const humanExists = user.humans.find(
          (userHuman) => userHuman.vat === human.vat,
        );

        if (!humanExists) {
          user.humans.push(human);
        }
      }

      user.projects.push(...linked_user.projects);
      user.contracts.push(...linked_user.contracts);
      user.timesheets.push(...linked_user.timesheets);
    }

    return user;
  }

  async getLinkedUsers(uid: string) {
    const user = await this.userModel
      .findOne({ uid })
      .populate('linked_users')
      .exec();

    if (!user) {
      return;
    }

    const emails = user.linked_users.map((linkedUser) => {
      return linkedUser.email;
    });

    return emails;
  }

  async unlinkUser(uid: string, email: string) {
    const user = await this.userModel.findOne({ uid }).exec();

    if (!user) {
      return;
    }

    const userToUnlink = await this.userModel
      .findOne({
        email: email.toLowerCase(),
      })
      .populate('linked_users')
      .exec();

    if (!userToUnlink) {
      return;
    }

    user.linked_users = user.linked_users.filter((userToUnlink) => {
      userToUnlink.email !== email;
    });

    //for every linked user of the user with the email given, remove the user with the email given

    for (const linkedUser of user.linked_users) {
      const user = await this.userModel.findOne({ _id: linkedUser }).exec();

      if (!user) {
        return;
      }

      user.linked_users = user.linked_users.filter(
        (linkedUser) => linkedUser.email !== email,
      );

      userToUnlink.linked_users = userToUnlink.linked_users.filter(
        (linkedUser) => linkedUser.email !== user.email,
      );

      await user.updateOne(user);
    }

    await user.updateOne(user);

    userToUnlink.linked_users = userToUnlink.linked_users.filter(
      (linkedUser) => linkedUser.email !== user.email,
    );

    return userToUnlink.updateOne(userToUnlink);
  }
}
