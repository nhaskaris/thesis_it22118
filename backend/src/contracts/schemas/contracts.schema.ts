import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Interval } from '../../types/interval';
import { Project } from '../../projects/schemas/projects.schemas';
import { Human } from '../../humans/schemas/humans.schema';
import { Wp } from '../../wps/schemas/wps.schema';

export type ContractDocument = Contract & mongoose.HydratedDocument<Contract>;

@Schema()
export class Contract {
  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' } })
  project: Project;

  @Prop({ type: { type: mongoose.Schema.Types.ObjectId, ref: 'Human' } })
  human: Human;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wp' }] })
  wps: Wp[];

  @Prop(
    raw({
      startDate: { type: String },
      endDate: { type: String },
      _id: false,
    }),
  )
  duration: Interval;

  @Prop()
  hourlyRate: number;

  @Prop()
  totalCost: number;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
