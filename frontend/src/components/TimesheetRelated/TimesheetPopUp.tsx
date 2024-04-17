import React, { useState } from 'react';
import { AlertInfo, Wp } from '@/types/pages';
import Alert from '@/components/Alert';

export default function AddHoursPopup({ selectedDate, onClose, wps, onHoursDataChange }: { selectedDate: Date, onClose: () => void, wps: Wp[], onHoursDataChange: (newHoursData: { [key: number]: number }) => void }) {
    const [hoursData, setHoursData] = useState<{ [key: string]: number }>({});
    const [alert, setAlert] = useState<AlertInfo | null>(null);

    const handleInputChange = (workPackageId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setHoursData(prevData => ({
            ...prevData,
            [workPackageId]: parseInt(value, 10) || 0
        }));
    };

    const calculateTotalHours = () => {
        let totalHours = 0;
        for (const key in hoursData) {
            totalHours += hoursData[key];
        }
        return totalHours;
    };

    const handleSave = () => {
        const totalHours = calculateTotalHours();
        if (totalHours > 8) {
            setAlert({ message: 'Total hours cannot exceed 8', severity: 'error', visible: true, onClose: () => setAlert(null) });
            return;
        }
        const selectedDateUnix = Math.floor(selectedDate.getTime() / 1000);
        const newHoursData = { [selectedDateUnix]: totalHours }; 
        onHoursDataChange(newHoursData); 
        onClose();
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-gray-200 p-6 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-black">Add Hours for {selectedDate.toDateString()}</h2>
                {wps.map(wp => (
                    <div key={wp._id} className="mb-4">
                        <label htmlFor={`hours-${wp._id}`} className="block text-sm font-medium text-black">{wp.title}</label>
                        <input 
                            type="number" 
                            id={`hours-${wp._id}`} 
                            name={`hours-${wp._id}`} 
                            value={hoursData[wp._id!] || ''}
                            onChange={(e) => handleInputChange(wp._id!, e)} 
                            className={`mt-1 block w-full rounded-md text-black border shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50`}
                        />
                    </div>
                ))}
                <p className="text-black">Total Hours: {calculateTotalHours()}</p>
                <div className="flex justify-end">
                    <button onClick={handleSave} type="button" className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Save</button>
                    <button onClick={onClose} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
                </div>
                {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
            </div>
        </div>
    );
}
