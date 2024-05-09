import { Interval } from "@/types/pages";

export const formatUnixTimestamp = (timestamp: string): string => {
    return new Date(parseInt(timestamp)).toLocaleDateString();
};

//returns the date of the timestamp plus the duration in months in the format of MM/DD/YYYY
export const formatUnixTimestampDuration = (timestamp: string, duration: number): string => {
    const date = new Date(parseInt(timestamp));
    date.setMonth(date.getMonth() + duration);

    return date.toLocaleDateString();
}

export const formatUnixTimestampWpInterval = (wp_timestamp: string, project_timestamp: string, duration?: number): string => {
    const wp_offset_months = parseInt(wp_timestamp.substring(1));
    const project_offset = parseInt(project_timestamp);
    const date = new Date(project_offset);

    date.setMonth(date.getMonth() + wp_offset_months);

    date.setDate(1);
    
    if (duration) {
      date.setMonth(date.getMonth() + duration);
    }

    if (wp_offset_months == 0) {
      date.setDate(new Date(project_offset).getDate());
    }

    return date.toLocaleDateString();
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
  const wp_timestamp_endDate = formatUnixTimestampDuration(wp_timestamp_startDate, interval.duration)

  const project_startDate = new Date(Number(project_start_timestamp)).toLocaleDateString();
  const project_endDate = formatUnixTimestampDuration(project_start_timestamp, project_duration);

  if (new Date(wp_timestamp_startDate) >= new Date(project_startDate) && new Date(wp_timestamp_endDate) <= new Date(project_endDate)) {
    return true;
  }

  return false;
}

export const isObjectActive = (interval: Interval): boolean => {
  const start_date = new Date(Number(interval.startDate)).toLocaleDateString();
  const end_date = formatUnixTimestampDuration(interval.startDate, interval.duration);

  if (new Date(start_date) <= new Date() && new Date(end_date) >= new Date()) {
    return true;
  }

  return false;
}