import React from 'react';
import { User } from '@/types/pages';
import { DeleteButton } from "./DeleteButton";

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  // Function to count the number of projects
  const projectCount = user.projects.length;

  // Function to count the number of humans
  const humanCount = user.humans.length;

  // Function to count the number of work packages (wps)
  const wpCount = user.wps.length;

  return (
    <div className="bg-gray-800 shadow-md rounded-md p-4 text-white">
      <h1 className="text-xl font-bold mb-2">{user.email}</h1>
      <p className="text-gray-300 mb-2">Role: {user.role}</p>
      <p className="text-gray-300 mb-2">Projects: {projectCount}</p>
      <p className="text-gray-300 mb-2">Humans: {humanCount}</p>
      <p className="text-gray-300 mb-2">Work Packages: {wpCount}</p>
      <DeleteButton id={user._id!} endpoint="users"/>
    </div>
  );
};

export default UserCard;