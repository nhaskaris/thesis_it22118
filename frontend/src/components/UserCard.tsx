import React from 'react';
import { User } from '@/types/pages';
import { DeleteButton } from "./DeleteButton";

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  const projectCount = user.projects ? user.projects.length : 0;

  const humanCount = user.humans ? user.humans.length : 0;

  const wpCount = user.wps ? user.wps.length : 0;

  const contractCount = user.contracts ? user.contracts.length : 0;

  const timesheetCount = user.timesheets ? user.timesheets.length : 0;

  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold text-gray-400 ">User Entry</div>
            </div>
            <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-400 mr-2">User email:</div>
                <div className="text-sm font-semibold text-gray-200">{user.email}</div>
            </div>
            <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-400 mr-2">Role:</div>
                <div className="text-sm font-semibold text-gray-200">{user.role}</div>
            </div>
            <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-400 mr-2">Total Projects:</div>
                <div className="text-sm font-semibold text-gray-200">{projectCount}</div>
            </div>
            <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-400 mr-2">Total Humans:</div>
                <div className="text-sm font-semibold text-gray-200">{humanCount}</div>
            </div>
            <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-400 mr-2">Total Work Packages:</div>
                <div className="text-sm font-semibold text-gray-200">{wpCount}</div>
            </div>
            <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-400 mr-2">Total Contracts:</div>
                <div className="text-sm font-semibold text-gray-200">{contractCount}</div>
            </div>
            <div className="flex items-center mb-2">
                <div className="text-sm font-medium text-gray-400 mr-2">Total Timesheets:</div>
                <div className="text-sm font-semibold text-gray-200">{timesheetCount}</div>
            </div>
        </div>

      <DeleteButton id={user._id!} endpoint="users"/>
    </div>
  );
};

export default UserCard;