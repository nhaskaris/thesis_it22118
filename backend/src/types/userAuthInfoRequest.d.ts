import { Request } from 'express';
import { Project } from 'src/projects/schemas/projects.schemas';
import { User } from 'src/users/schemas/users.schemas';
import { Contract } from 'src/contracts/schemas/contracts.schemas';
import { Wp } from 'src/wps/schemas/wps.schemas';
import { Human } from 'src/humans/schemas/humans.schemas';

export interface IGetUserAuthInfoRequest extends Request {
   user?: User;
}

export interface InfoAdmin {
   projects: Project[];
   contracts: Contract[];
   wps: Wp[];
   humans: Human[];
}
