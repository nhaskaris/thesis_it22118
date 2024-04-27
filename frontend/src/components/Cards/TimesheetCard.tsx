import { Holiday, Timesheet } from '@/types/pages';
import React from 'react';
import { DeleteButton } from "../DeleteButton";
import { EditButton } from '../EditButton';

const TimesheetCard: React.FC<{ timesheet: Timesheet, holidays: Holiday[]}> = ({ timesheet, holidays }) => {
    const formatUnixTimestamp = (timestamp: string): string => {
        return new Date(parseInt(timestamp)).toLocaleDateString();
    };

    const totalHours = timesheet.days.reduce((acc, day) => acc + day.hoursWorked, 0);

    return (
        <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-400 ">Timesheet Entry: </div>
                    <div className="text-sm text-gray-200">{formatUnixTimestamp(timesheet.timestamp_created)}</div>
                </div>
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-400 mr-2">Id:</div>
                    <div className="text-sm font-semibold text-gray-200">{timesheet._id}</div>
                </div>
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-400 mr-2">Total Hours:</div>
                    <div className="text-sm font-semibold text-gray-200">{totalHours}</div>
                </div>
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-400 mr-2">Contract:</div>
                    <div className="text-sm font-semibold text-gray-200">{timesheet.contract.project.title}, {timesheet.contract.human.lastName} {timesheet.contract.human.firstName}</div>
                </div>
            </div>
            
            <div className="flex justify-between mb-4">
                <EditButton data={timesheet} url="/timesheets/updateTimesheet" holidays={holidays}/>
                <DeleteButton id={timesheet._id!} endpoint="timesheets"/>
            </div>
        </div>
    );
};

export default TimesheetCard;