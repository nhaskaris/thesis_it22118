import { Interval } from "@/types/pages";
import dayjs from "dayjs";

export const formatUnixTimestamp = (timestamp: string): string => {
    return dayjs(Number(timestamp)).format('MM/DD/YYYY');
};

//returns the date of the timestamp plus the duration in months in the format of MM/DD/YYYY
export const formatUnixTimestampDuration = (timestamp: number, duration: number): string => {
    const date = dayjs(timestamp).add(duration, 'month');

    return date.format('MM/DD/YYYY');
}

export const formatUnixTimestampWpInterval = (wp_timestamp: string, project_timestamp: string, duration?: number): string => {
    const wp_offset_months = parseInt(wp_timestamp.substring(1));
    const project_offset = parseInt(project_timestamp);
    let date = dayjs(project_offset);

    date = date.add(wp_offset_months, 'month');

    date = date.startOf('month');

    if (duration) {
      date = date.add(duration, 'month');
    }

    if (wp_offset_months === 0) {
      date = date.date(dayjs(project_offset).date());
    }

    return date.format('MM/DD/YYYY');
}

export const isIntervalValid = (interval: Interval): boolean => {
    if (interval.startDate.length != 3) {
      return false;
    }

    if (interval.startDate[0] != 'M') {
      return false;
    }

    if (
      isNaN(Number(interval.startDate[1])) ||
      isNaN(Number(interval.startDate[2]))
    ) {
      return false;
    }


    return true;
}

export const isWpActive = (interval: Interval | Interval[], project_start_timestamp: string, project_duration: number): boolean => {
  if (Array.isArray(interval)) {
    for (const i of interval) {
      if (!isWpActive(i, project_start_timestamp, project_duration)) {
        return false;
      }
    }

    return true;
  }

  //project interval should be greater than or equal to work package interval
  const wp_timestamp_startDate = formatUnixTimestampWpInterval(interval.startDate, project_start_timestamp);
  const wp_timestamp_startDate_unix = Math.floor(new Date(wp_timestamp_startDate).getTime());
  const wp_timestamp_endDate = formatUnixTimestampDuration(wp_timestamp_startDate_unix, interval.duration)

  const project_startDate = dayjs(Number(project_start_timestamp)).format('MM/DD/YYYY');
  const project_endDate = formatUnixTimestampDuration(parseInt(project_start_timestamp), project_duration);

  if (new Date(wp_timestamp_startDate) >= new Date(project_startDate) && new Date(wp_timestamp_endDate) <= new Date(project_endDate)) {
    return true;
  }

  return false;
}

export const isObjectActive = (interval: Interval): boolean => {
  const start_date = new Date(Number(interval.startDate)).toDateString();
  const end_date = formatUnixTimestampDuration(Number(interval.startDate), interval.duration);

  if (new Date(start_date) <= new Date() && new Date(end_date) >= new Date()) {
    return true;
  }

  return false;
}