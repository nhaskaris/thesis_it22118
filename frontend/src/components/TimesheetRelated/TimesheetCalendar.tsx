import React, { useState, useMemo, useEffect } from 'react';
import { generateCalendar } from '@/tools/utils';
import { AlertInfo, Contract, Day, Holiday, Wp } from "@/types/pages";
import AddHoursPopup from '@/components/TimesheetRelated/TimesheetPopUp';
import Alert from '@/components/Alert';
import { isWpActive } from '@/Utils/formatTimestamp';

export default function TimesheetCreation({ selectedContract, holidays, days, timesheet_id }: { selectedContract: Contract, holidays: Holiday[], days?: Day[], timesheet_id?: string}) {
    const activeWps: Wp[] = [];

    for(const wp of selectedContract.wps) {
        if (isWpActive(wp.activeIntervals, selectedContract.project.interval.startDate, selectedContract.project.interval.duration)) {
            activeWps.push(wp);
        }
    }

    const hoursdata: { [key: string]: { [key: string]: number } } = {};

    // Example of how to update hoursdata with wp ID and hours for each date
    if (days) {
        for (const day of days) {
            const dateKey = day.date.toString(); // Convert date to string to use as key
            hoursdata[dateKey] = {}; // Initialize object for the date key

            // Populate hoursdata with wp ID and hours for each work package
            for (const wp of day.workPackages) {
                hoursdata[dateKey][wp.wp._id!] = wp.hours; // Set wp ID as key and hours as value
            }
        }
    }

    const currentDate = new Date();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isAddHoursPopupOpen, setIsAddHoursPopupOpen] = useState(false);
    const [hoursData, setHoursData] = useState<{ [key: string]: { [key: string]: number } }>(hoursdata);
    const [allowWeekendClick, setAllowWeekendClick] = useState(false);
    const calendar = generateCalendar(currentDate.getFullYear(), currentDate.getMonth(), holidays);
    const [alert, setAlert] = useState<AlertInfo | null>(null);

    const handleDateClick = (date: Date) => {
        if (!allowWeekendClick && (date.getDay() === 0 || date.getDay() === 6) || holidays.some(holiday => {
            const holidayDate = new Date(holiday.dateIso);
            return holidayDate.getFullYear() === date.getFullYear() && holidayDate.getMonth() === date.getMonth() && holidayDate.getDate() === date.getDate();
        })
        ) {
            return;
        }
        setSelectedDate(date);
        setIsAddHoursPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsAddHoursPopupOpen(false);
        setSelectedDate(null);
    };

    const handleHoursDataChange = (newHoursData: { [key: string]: { [key: string]: number } }) => {
        setHoursData(prevHoursData => ({
            ...prevHoursData,
            ...newHoursData
        }));
    };

    const handleCancel = () => {
        window.location.href = '/timesheets';
    }

    const handleCreateTimesheet = async () => {
        if (totalHoursForMonth > 143 || totalHoursForMonth == 0) {
            return;
        }

        const daysData = Object.keys(hoursData).map(date => {
            return {
                date: date,
                workPackages: Object.keys(hoursData[date]).map(wpId => {
                    return {
                        wp: activeWps.find(wp => wp._id === wpId)!,
                        hours: hoursData[date][wpId]
                    };
                })
            };
        });

        const timesheet = {
            days: daysData,
            contract: selectedContract,
            timestamp_created: new Date().getTime(),
            _id: timesheet_id
        };

        const res = await fetch('/api', { 
            method: timesheet_id ? 'PATCH' : 'POST', 
            body: JSON.stringify({"timesheet": timesheet}), 
            headers: { 
                'Content-Type': 'application/json' 
            }
          });
      
          if (!res.ok) {
            const resData = await res.text();
            return setAlert({ message: resData, severity: 'error', visible: true, onClose: () => setAlert(null)});
          }
      
          window.location.href = '/timesheets';
    }

    // Calculate total hours for the month
    const totalHoursForMonth = useMemo(() => {
        return Object.values(hoursData).reduce((totalHours, dayHours) => {
            return totalHours + Object.values(dayHours).reduce((totalHours, wpHours) => totalHours + wpHours, 0);
        }, 0);
    }, [hoursData]);

    return (
        <div>
            <br />
            <h2 className="text-2xl font-bold mb-4">Timesheet for {selectedContract.project.title}</h2>
            <label>
                <input 
                    type="checkbox" 
                    checked={allowWeekendClick} 
                    onChange={(e) => setAllowWeekendClick(e.target.checked)} 
                    className="mr-2"
                />
                Allow entering hours for weekend and Holidays
            </label>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Weekend</th>
                        <th className="border border-gray-300 px-4 py-2">Holiday</th>
                        <th className="border border-gray-300 px-4 py-2">Total Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {calendar.map(day => (
                        <tr key={day.date.toString()} className="border border-gray-300">
                            <td 
                                className={`border border-gray-300 px-4 py-2 cursor-pointer ${
                                    selectedDate && selectedDate.toDateString() === day.date.toDateString() ? 'bg-blue-200' : ''
                                }`}
                                onClick={() => handleDateClick(day.date)}
                            >
                                {day.date.toDateString()}
                            </td>
                            <td className={`border border-gray-300 px-4 py-2`} style={!allowWeekendClick && (day.isWeekend || holidays.some(holiday => new Date(holiday.dateIso).toDateString() === day.date.toDateString())) ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>{day.isWeekend ? 'Yes' : 'No'}</td>
                            <td className={`border border-gray-300 px-4 py-2`} style={!allowWeekendClick && (day.isWeekend || holidays.some(holiday => new Date(holiday.dateIso).toDateString() === day.date.toDateString())) ? { opacity: 0.6, cursor: 'not-allowed' } : {}}>{day.isHoliday ? 'Yes' : 'No'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-white">{!hoursData[Math.floor(day.date.getTime() / 1000)] ? 0 : Object.values(hoursData[Math.floor(day.date.getTime() / 1000)]).reduce((total, hours) => total + hours, 0)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-white mt-4">Total Hours for the Month: {totalHoursForMonth}</p>
            {totalHoursForMonth > 143 && <p className="text-red-500">Warning: Total hours for the month exceed 143 hours.</p>}
            <div className="flex justify-end mt-4">
                <button type='button' className="bg-red-500 text-white px-4 py-2 rounded-md mr-2" onClick={handleCancel}>Cancel</button>
                {!timesheet_id && <button type='button' className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleCreateTimesheet}>Create</button>}
                {timesheet_id && <button type='button' className="bg-orange-600 text-white px-4 py-2 rounded-md" onClick={handleCreateTimesheet}>Edit</button>}
            </div>
            {isAddHoursPopupOpen && (
                <AddHoursPopup selectedDate={selectedDate!} onClose={handleClosePopup} wps={activeWps} onHoursDataChange={handleHoursDataChange} oldData={hoursData[Math.floor(selectedDate!.getTime() / 1000)]}/>
            )}
            {alert && <Alert message={alert.message} severity={alert.severity} visible={alert.visible} onClose={alert.onClose}/>}
        </div>
    );
}
