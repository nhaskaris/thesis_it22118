'use client'

import { useEffect, useState } from 'react';
import { Project, Wp, Interval, AlertInfo } from '@/types/pages';
import { useRouter, useSearchParams } from 'next/navigation'
import Alert from '@/components/Alert';
import dayjs from 'dayjs';

export default function UpdateProjectPage({searchParams}: {searchParams: {data: string}}) {
  const projects: Project = JSON.parse(searchParams.data);

  for (const wp of projects.wps) {
    wp.activeIntervals.forEach(interval => {
      interval.startDate = dayjs(Number(interval.startDate)).format('YYYY-MM-DD');
      interval.endDate = dayjs(Number(interval.endDate)).format('YYYY-MM-DD');
    });
  }
  const wps: Wp[] = projects.wps;

  const [title, setTitle] = useState(projects.title);
  const [description, setDescription] = useState(projects.description);
  const [workPackages, setWorkPackages] = useState<Wp[]>(wps);
  const [intervalStart, setIntervalStart] = useState(dayjs(Number(projects.interval.startDate)).format('YYYY-MM-DD'));
  const [intervalEnd, setIntervalEnd] = useState(dayjs(Number(projects.interval.endDate)).format('YYYY-MM-DD'));
  const [id, setId] = useState(projects.id);
  const router = useRouter()

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const [alert, setAlert] = useState<AlertInfo | null>(null);

  // Function to display the alert
  const showAlert = (message: string, severity: string) => {
    setAlert({ message, severity, visible: true, onClose: () => setAlert(null)});
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleWorkPackageChange = (index: number, field: keyof Wp, value: string) => {
    const updatedWorkPackages = [...workPackages];
    updatedWorkPackages[index] = {
      ...updatedWorkPackages[index],
      [field]: value
    };
    setWorkPackages(updatedWorkPackages);
  };

  const handleIntervalChange = (wpIndex: number, intervalIndex: number, field: keyof Interval, value: string) => {
    const updatedWorkPackages = [...workPackages];
    if (field === 'startDate') {
      updatedWorkPackages[wpIndex].activeIntervals[intervalIndex] = {
        ...updatedWorkPackages[wpIndex].activeIntervals[intervalIndex],
        [field]: value
      };
    } else {
      updatedWorkPackages[wpIndex].activeIntervals[intervalIndex] = {
        ...updatedWorkPackages[wpIndex].activeIntervals[intervalIndex],
        [field]: value
      };
    }
    setWorkPackages(updatedWorkPackages);
  };

  const parseDateToTimestamp = (dateString: string) => {
    return new Date(dateString).getTime()
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    const newProject: Project = {
      id,
      title,
      description,
      wps: structuredClone(workPackages),
      interval: { startDate: intervalStart, endDate: intervalEnd },
    };

    for (const wp of newProject.wps) {
      for (const interval of wp.activeIntervals) {
        const startDate = parseDateToTimestamp(interval.startDate);
        const endDate = parseDateToTimestamp(interval.endDate);

        if (startDate && endDate) {
          interval.startDate = String(startDate);
          interval.endDate = String(endDate);
        }
      }
    }

    const startDate = parseDateToTimestamp(newProject.interval.startDate);
    const endDate = parseDateToTimestamp(newProject.interval.endDate);

    newProject.interval.startDate = String(startDate);
    newProject.interval.endDate = String(endDate);

    const res = await fetch('/api', { 
        method: 'PATCH', 
        body: JSON.stringify({"project": newProject}), 
        headers: { 
            'Content-Type': 'application/json' 
        }
    });

    if (!res.ok) {
      return showAlert(await res.text(), 'error');
    }

    window.location.href = '/projects';
  };

  const handleCancel = () => {
    router.push('/projects')
  }

  return (
    <div className="container mx-auto py-8 border border-gray-300 rounded-md shadow-md p-8 mt-2 bg-gray-800">
      <h1 className="text-3xl font-semibold mb-4">Update Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-white-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-white-700">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>
        {workPackages.map((wp, wpIndex) => (
          <div key={wpIndex} className="mb-4">
            <label className="block text-sm font-medium text-white-700 mb-1">Work Package {wpIndex + 1}</label>
            <input
              type="text"
              value={wp.title}
              onChange={(e) => handleWorkPackageChange(wpIndex, 'title', e.target.value)}
              className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
              required
            />
            <div className="mb-2 ml-4">
              <label className="block text-sm font-medium text-white-700 mb-1">Start Date 1</label>
              <input
                type="date"
                value={wp.activeIntervals[0] ? wp.activeIntervals[0].startDate : ''}
                onChange={(e) => handleIntervalChange(wpIndex, 0, 'startDate', e.target.value)}
                className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                required
                min={wp.activeIntervals[0] ? wp.activeIntervals[0].startDate : ''}
              />
              <label className="block text-sm font-medium text-white-700 mb-1">End Date 1</label>
              <input
                type="date"
                value={wp.activeIntervals[0] ? wp.activeIntervals[0].endDate : ''}
                onChange={(e) => handleIntervalChange(wpIndex, 0, 'endDate', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                required
                min={wp.activeIntervals[0] ? wp.activeIntervals[0].endDate : ''}
              />
            </div>
            {wp.activeIntervals.slice(1).map((interval, intervalIndex) => (
              <div key={intervalIndex + 1} className="mb-2 ml-4">
                <label className="block text-sm font-medium text-white-700 mb-1">Start Date {intervalIndex + 2}</label>
                <input
                  type="date"
                  value={interval.startDate}
                  onChange={(e) => handleIntervalChange(wpIndex, intervalIndex + 1, 'startDate', e.target.value)}
                  className="mr-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                  required
                  min={interval.startDate}
                />
                <label className="block text-sm font-medium text-white-700 mb-1">Duration {intervalIndex + 2}</label>
                <input
                  type="date"
                  value={interval.endDate}
                  onChange={(e) => handleIntervalChange(wpIndex, intervalIndex + 1, 'endDate', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black bg-gray-200"
                  required
                  min={interval.endDate}
                />
              </div>
            ))}
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="intervalStart" className="block text-sm font-medium text-white-700">
              Start Date of Project
            </label>
            <input
              type="date"
              id="intervalStart"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
              value={intervalStart}
              onChange={(e) => setIntervalStart(e.target.value)}
              required
              min={intervalStart}
            />
          </div>
          <div>
            <label htmlFor="intervalEnd" className="block text-sm font-medium text-white-700">
              End Date of Project
            </label>
            <input
              type="date"
              id="intervalEnd"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-black"
              value={intervalEnd}
              onChange={(e) => setIntervalEnd(e.target.value)}
              required
              min={intervalEnd}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="w-1/2 mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-1/2 ml-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Edit Project
          </button>
        </div>
        <div>
          {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
        </div>
      </form>
    </div>
  );
};