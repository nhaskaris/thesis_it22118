import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Wp } from '../../wps/schemas/wps.schema';
import { Project } from 'src/projects/schemas/projects.schemas';
import { Human } from 'src/humans/schemas/humans.schema';

export type TimesheetsDocument = Timesheet &
   mongoose.HydratedDocument<Timesheet>;

@Schema()
export class Timesheet {
   @Prop()
   hours: number;

   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
   project: Project;

   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Human' })
   human: Human;

   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wp' })
   wp: Wp;

   @Prop()
   date: string;
}

export const TimesheetSchema = SchemaFactory.createForClass(Timesheet);
