import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HumanDocument = HydratedDocument<Human>;

@Schema()
export class Human {
  @Prop()
  lastName: string;

  @Prop()
  firstName: string;

  @Prop()
  vat: string;
}

export const HumanSchema = SchemaFactory.createForClass(Human);
