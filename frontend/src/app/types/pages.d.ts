export interface Project {
    id: number;
    title: string;
    description: string;
    wp: any[];
    interval: Interval;
}

export interface Interval {
    startDate: string;
    endDate: string;
}