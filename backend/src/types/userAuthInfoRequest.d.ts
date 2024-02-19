import { Request } from 'express';
import { User } from 'src/users/schemas/users.schemas';

export interface IGetUserAuthInfoRequest extends Request {
   user?: User;
}
