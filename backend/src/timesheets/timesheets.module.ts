import { Module } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { TimesheetsController } from './timesheets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Timesheet, TimesheetSchema } from './schemas/timesheets.schemas';

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: Timesheet.name, schema: TimesheetSchema },
      ]),
   ],
   controllers: [TimesheetsController],
   providers: [TimesheetsService],
   exports: [TimesheetsService],
})
export class TimesheetsModule {}
