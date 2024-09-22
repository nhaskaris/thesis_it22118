import { cookies } from 'next/headers'
import { User } from '@/types/pages';
import { redirect } from 'next/navigation';
import LinkedUserCard from "@/components/Cards/LinkedUserCard"
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

async function getData() {
    const userCookies = cookies().get('token')

    if (!userCookies) {
        return redirect('/')
    }

    const res = await fetch(`${process.env.BACKEND_URL}/users/linkedUsers`, {
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

    return data;
}

export default async function Home({searchParams}: {searchParams: {q: string}}) {
    const linkedUsers: string[]= await getData();

    let filteredLinkedUsers = linkedUsers

    if (searchParams.q) {
        filteredLinkedUsers = filteredLinkedUsers.filter((linkedUser) => {
            return linkedUser.toLowerCase().includes(searchParams.q.toLowerCase());
        });
    } else {
        filteredLinkedUsers = linkedUsers;
    }

    return (
        <div className="container mt-8 mx-auto py-8 border border-gray-300 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
                <div></div>
                <Link
                href="/link/createLink"
                className="mr-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Create Link
                </Link>
            </div>
            <SearchBar items={filteredLinkedUsers} endpoint={'link'} placeholder='by email'/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-4">
                {filteredLinkedUsers && filteredLinkedUsers.map((linkedUser) => (
                    <LinkedUserCard key={linkedUser} email={linkedUser} />
                ))}
            </div>
        </div>
    )
}
