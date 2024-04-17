import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type HolidayDocument = Holiday & mongoose.HydratedDocument<Holiday>;

@Schema()
export class Holiday {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  dateIso: string;

  @Prop({ type: [String] })
  type: string[];
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);
