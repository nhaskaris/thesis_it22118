'use client'

import { Timesheet } from "@/types/pages";
import { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from "dayjs";
import CsvDownloader, { ICsvProps } from 'react-csv-downloader';

export const ExportTimesheet = ({ data, filename }: { data: Timesheet[], filename: string }) => {
    const [monthYear, setMonthYear] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Timesheet[]>([]);
    const [csvProps, setCsvProps] = useState<ICsvProps>();

    const handleChange = (Dayjs: Dayjs | null) => {
        if (!Dayjs) return;

        setMonthYear(Dayjs.format('MM-YYYY'));
    };

    useEffect(() => {
        if (!monthYear) return;

        const [month, year] = monthYear.split('-');
        const filteredData = data.filter((timesheet) => {
            const timesheetDate = new Date(Number(timesheet.timestamp_created));
            return timesheetDate.getMonth() === parseInt(month) && timesheetDate.getFullYear() === parseInt(year);
        });

        setFilteredData(filteredData);
    }, [data, monthYear]);

    useEffect(() => {
        if (!filteredData.length) return;
        const csvData = filteredData.map((timesheet) => {
            let totalHours = 0
            timesheet.days.forEach((day) => {
                totalHours += day.hoursWorked;
            });

            return {
                'total_hours': String(totalHours),
                'project_id': timesheet.contract.project.id,
                'timestamp_created': new Date(Number(timesheet.timestamp_created)).toLocaleString(),
            };
        });

        const headers = [
            { displayName: 'Total Hours', id: 'total_hours' },
            { displayName: 'Project ID', id: 'project_id' },
            { displayName: 'Timestamp Created', id: 'timestamp_created' },
        ];

        const props: ICsvProps = {
            datas: csvData,
            columns: headers,
            separator: ';',
        };

        setCsvProps(props);
    }, [filteredData]);

    return (
        <div className="flex justify-center items-center ml-8">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label={'"month" and "year" to export'} views={['month', 'year']} className="bg-white rounded-md p-2 mr-2" onChange={handleChange}/>
            </LocalizationProvider>
            {csvProps && <CsvDownloader {...csvProps} filename={filename} text="Export" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"/>}
        </div>
    );
}