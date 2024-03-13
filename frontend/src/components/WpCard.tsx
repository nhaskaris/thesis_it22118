import React from 'react';
import { Wp } from '@/types/pages';
import { DeleteButton } from "./DeleteButton";

const WPCard: React.FC<{ wp: Wp }> = ({ wp }) => {
  const formatUnixTimestamp = (timestamp: string): string => {
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  return (
    <div className="wp-card bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <h1 className="text-xl font-bold mb-2">{wp.title}</h1>
        <div className="mb-2">Active Intervals:</div>
        <ul id="intervalList" className="list-disc pl-5">
            {wp.activeIntervals.map((interval, index) => (
                <li className="mb-1" key={index}>
                    <span className="font-semibold">Start Date:</span> <span className="text-gray-300">{formatUnixTimestamp(interval.startDate)}</span>
                    <br />
                    <span className="font-semibold">End Date:</span> <span className="text-gray-300">{formatUnixTimestamp(interval.endDate)}</span>
                </li>
            ))}
        </ul>
        <DeleteButton id={wp._id!} endpoint="wps"/>
    </div>
  );
};

export default WPCard;