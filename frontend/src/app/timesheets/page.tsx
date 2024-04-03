import { cookies } from 'next/headers'
import { User } from '../../types/pages';
import { redirect } from 'next/navigation';
import Link from "next/link";
import TimesheetCard from '@/components/TimesheetCard';
import SearchBar from '@/components/SearchBar';


async function getData() {
    const userCookies = cookies().get('token')

    if (!userCookies) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    const res = await fetch(`${process.env.BACKEND_URL}/users/getProfile`, {
        headers: {
            authorization: 'Bearer ' + userCookies.value!
        },
        next: {
            revalidate: 0
        }
    }).catch(err => {
        return err.statusText;
    })

    if(!res) {
        redirect('/')
    }

    if (!res.ok) {
        redirect('/')
    }
    
    const data = await res.json();

    return data
}

export default async function Home({searchParams}: {searchParams: {q: string}}) {
    const data: User = await getData();

    let filteredTimesheets = data.timesheets


    if (searchParams.q) {
        filteredTimesheets = filteredTimesheets.filter((timesheet) => {
            return timesheet['_id']!.toLowerCase().includes(searchParams.q.toLowerCase());
        });
    } else {
        filteredTimesheets = data.timesheets
    }

    return (
        <div className="container mt-8 mx-auto py-8 border border-gray-300 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
                <div></div>
                <Link
                href={{
                    pathname: "/timesheets/createTimesheet",
                    query: {
                        humans: JSON.stringify(data.humans),
                        projects: JSON.stringify(data.projects)
                    }
                }}
                className="mr-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Timesheet
                </Link>
            </div>
            <SearchBar items={filteredTimesheets} endpoint='timesheets'/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {filteredTimesheets && filteredTimesheets.map((timesheet) => (
                    <TimesheetCard key={timesheet._id} timesheet={timesheet} />
                ))}
            </div>
        </div>
    );
}
  