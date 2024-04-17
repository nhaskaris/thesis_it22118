import { Holiday } from "@/types/pages";

export function generateCalendar(year: number, month: number, holidays: Holiday[]) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(year, month, i);
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday (0) or Saturday (6)
        
        const isHoliday = holidays.some(holiday => {
            const holidayDate = new Date(holiday.dateIso);
            return holidayDate.getFullYear() === year && holidayDate.getMonth() === month && holidayDate.getDate() === i;
        });

        calendar.push({
            date: currentDate,
            isWeekend,
            isHoliday
        });
    }

    return calendar;
}