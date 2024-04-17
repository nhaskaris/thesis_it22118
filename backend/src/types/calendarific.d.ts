export interface CalendarificResponse {
  holidays: CalendarificHoliday[];
}

export interface CalendarificHoliday {
  name: string;
  description: string;
  date: {
    iso: string;
    datetime: {
      year: number;
      month: number;
      day: number;
    };
  };
  type: string[];
}
