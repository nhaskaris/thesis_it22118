import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Contract } from 'src/contracts/schemas/contracts.schema';
import { Day } from 'src/types/day';

export type TimesheetsDocument = Timesheet &
  mongoose.HydratedDocument<Timesheet>;

@Schema()
export class Timesheet {
  @Prop({
    raw: [
      {
        timestamp: { type: String },
        workPackages: [
          {
            wp: { type: mongoose.Schema.Types.ObjectId, ref: 'Wp' },
            hours: { type: Number },
          },
        ],
        _id: false,
      },
    ],
  })
  days: Day[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' })
  contract: Contract;

  @Prop()
  timestamp_created: string;
}

export const TimesheetSchema = SchemaFactory.createForClass(Timesheet);
