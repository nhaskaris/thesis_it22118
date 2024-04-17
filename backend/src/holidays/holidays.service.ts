import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Holiday } from './schemas/holiday.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as axios from 'axios';
import { CalendarificHoliday } from 'src/types/calendarific';

@Injectable()
export class HolidaysService {
  constructor(@InjectModel('Holiday') private holidayModel: Model<Holiday>) {}

  async findAll() {
    const holidays = await this.holidayModel.find().exec();

    if (!holidays || holidays.length === 0) {
      await this.handleCron();
    }
    //return the holidays that do not include type Observance, Season
    return await this.holidayModel
      .find({ type: { $nin: ['Observance', 'Season'] } })
      .exec();
  }

  // This method will be called every day at 00:00 to request the holidays for the current year from https://calendarific.com/api/v2/holidays?&api_key=&country=GR&year='
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const currentYear = new Date().getFullYear();
    const holidays = await this.getHolidays(currentYear);

    // Save the holidays to the database by overwriting the existing ones
    await this.holidayModel.deleteMany({});

    await this.holidayModel.insertMany(holidays);
  }

  getHolidays(year: number): Promise<Holiday[]> {
    return axios.default
      .get(
        `https://calendarific.com/api/v2/holidays?&api_key=${process.env.CALENDARIFIC_API_KEY}&country=GR&year=${year}`,
      )
      .then((response) => {
        const holidays: Holiday[] = response.data.response.holidays.map(
          (holiday: CalendarificHoliday) => {
            return {
              name: holiday.name,
              description: holiday.description,
              dateIso: holiday.date.iso,
              type: holiday.type,
            };
          },
        );

        return holidays;
      });
  }
}
