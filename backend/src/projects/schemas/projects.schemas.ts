import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Interval } from '../../types/interval';
import { Wp } from '../../wps/schemas/wps.schema';

export type ProjectDocument = Project & mongoose.HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wp' }] })
  wps: Wp[];

  @Prop(
    raw({
      startDate: { type: String },
      endDate: { type: String },
      _id: false,
    }),
  )
  interval: Interval;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
