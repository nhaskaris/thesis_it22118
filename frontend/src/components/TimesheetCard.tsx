import { Timesheet } from '@/types/pages';
import React from 'react';
import { DeleteButton } from "./DeleteButton";

const TimesheetCard: React.FC<{ timesheet: Timesheet}> = ({ timesheet }) => {
    const formatUnixTimestamp = (timestamp: string): string => {
        return new Date(parseInt(timestamp)).toLocaleDateString();
      };

    return (
        <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-gray-400 ">Timesheet Entry: </div>
                    <div className="text-sm text-gray-200">{formatUnixTimestamp(timesheet.date)}</div>
                </div>
                <div className="flex items-center mb-2">
                    <div className="text-sm font-medium text-gray-400 mr-2">Project:</div>
                    <div className="text-sm font-semibold text-gray-200">{timesheet.project ? timesheet.project.title: 'Deleted'}</div>
                </div>
                <div className="flex items-center mb-2">
                    <div className="text-sm font-medium text-gray-400 mr-2">Work Package:</div>
                    <div className="text-sm font-semibold text-gray-200">{timesheet.wp ? timesheet.wp.title: 'Deleted'}</div>
                </div>
                <div className="flex items-center mb-2">
                    <div className="text-sm font-medium text-gray-400 mr-2">Employee:</div>
                    <div className="text-sm font-semibold text-gray-200">{timesheet.human.lastName}, {timesheet.human.firstName}</div>
                </div>
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-400 mr-2">Hours:</div>
                    <div className="text-sm font-semibold text-gray-200">{timesheet.hours}</div>
                </div>
                <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-400 mr-2">Id:</div>
                    <div className="text-sm font-semibold text-gray-200">{timesheet._id}</div>
                </div>
            </div>
            <DeleteButton id={timesheet._id!} endpoint="timesheets"/>
        </div>
    );
};

export default TimesheetCard;