import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Interval } from '../../types/interval';

export type WpsDocument = HydratedDocument<Wps>;

@Schema()
export class Wps {
  @Prop()
  title: string;

  @Prop(
    raw([
      {
        startDate: { type: String },
        endDate: { type: String },
        _id: false,
      },
    ]),
  )
  activeIntervals: Interval[];
}

export const WpsSchema = SchemaFactory.createForClass(Wps);
