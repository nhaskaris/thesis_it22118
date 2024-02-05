import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HumansDocument = HydratedDocument<Humans>;

@Schema()
export class Humans {
  @Prop()
  lastName: string;

  @Prop()
  firstName: string;

  @Prop()
  vat: string;
}

export const HumansSchema = SchemaFactory.createForClass(Humans);
