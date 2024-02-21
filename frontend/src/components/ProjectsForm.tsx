'use client'

import { useState } from 'react';
import { Project } from '../types/pages';

interface AddProjectFormProps {
  onSubmit: (newProject: Project) => void;
}

export const AddProjectForm: React.FC<AddProjectFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workPackages, setWorkPackages] = useState<string[]>([]);
  const [intervalStart, setIntervalStart] = useState('');
  const [intervalEnd, setIntervalEnd] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleWorkPackageChange = (index: number, value: string) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages[index] = value;
    setWorkPackages(updatedWorkPackages);
  };

  const handleAddWorkPackage = () => {
    setWorkPackages([...workPackages, '']);
  };

  const handleRemoveWorkPackage = (index: number) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages.splice(index, 1);
    setWorkPackages(updatedWorkPackages);
  };

  const handleIntervalStartChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntervalStart(event.target.value);
  };

  const handleIntervalEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIntervalEnd(event.target.value);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newProject: Project = {
      title,
      description,
      wps: workPackages.map((wp, index) => ({ title: wp, _id: `${index}`, activeIntervals: [] })),
      interval: { startDate: intervalStart, endDate: intervalEnd },
      _id: `${Date.now()}` // Just a basic unique identifier for demo purposes, replace it with your actual logic
    };
    
    onSubmit(newProject);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
          value={title}
          onChange={handleTitleChange}
          required
          onClick={handleOverlayClick}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
          value={description}
          onChange={handleDescriptionChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Work Packages</label>
        {workPackages.map((wp, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={wp}
              onChange={(e) => handleWorkPackageChange(index, e.target.value)}
              className="flex-1 mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
              required
              onClick={handleOverlayClick}
            />
            <button
              type="button"
              onClick={() => handleRemoveWorkPackage(index)}
              className="text-red-600 hover:text-red-700 focus:outline-none"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddWorkPackage}
          className="text-blue-600 hover:text-blue-700 focus:outline-none"
        >
          Add Work Package
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="intervalStart" className="block text-sm font-medium text-gray-700">
            Interval Start
          </label>
          <input
            type="text"
            id="intervalStart"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
            value={intervalStart}
            onChange={handleIntervalStartChange}
            required
          />
        </div>
        <div>
          <label htmlFor="intervalEnd" className="block text-sm font-medium text-gray-700">
            Interval End
          </label>
          <input
            type="text"
            id="intervalEnd"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
            value={intervalEnd}
            onChange={handleIntervalEndChange}
            onClick={handleOverlayClick}
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Project
        </button>
      </div>
    </form>
  );
};

export default AddProjectForm;
