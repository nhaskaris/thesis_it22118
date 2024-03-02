import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Project } from '../../projects/schemas/projects.schemas';
import { Human } from '../../humans/schemas/humans.schema';
import { Wp } from '../../wps/schemas/wps.schema';
import { Contract } from 'src/contracts/schemas/contracts.schema';
import { Timesheet } from 'src/timesheets/schemas/timesheets.schemas';

export type UserDocument = User & mongoose.HydratedDocument<User>;

@Schema()
export class User {
   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
   projects: Project[];

   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Human' }] })
   humans: Human[];

   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wp' }] })
   wps: Wp[];

   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }] })
   contracts: Contract[];

   @Prop({
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timesheet' }],
   })
   timesheets: Timesheet[];

   @Prop()
   email: string;

   @Prop()
   uid: string;

   @Prop()
   role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
