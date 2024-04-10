import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Interval } from '../../types/interval';

export type WpDocument = HydratedDocument<Wp>;

@Schema()
export class Wp {
   @Prop({
      unique: true,
   })
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

export const WpSchema = SchemaFactory.createForClass(Wp);
