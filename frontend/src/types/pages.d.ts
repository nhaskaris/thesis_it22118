export interface Project {
    title: string;
    description: string;
    wps: Wp[];
    interval: Interval;
    _id?: string;
}

export interface Interval {
    startDate: string;
    endDate: string;
}

export interface Wp {
    title: string;
    _id?: string;
    activeIntervals: Interval[];
}

export interface AlertInfo {
    message: string;
    severity: string;
}