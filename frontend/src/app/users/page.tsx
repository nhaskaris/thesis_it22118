import { cookies } from 'next/headers'
import { User } from '@/types/pages';
import { redirect } from 'next/navigation';
import Link from "next/link";
import UserCard from "@/components/Cards/UserCard"
import SearchBar from '@/components/SearchBar';

async function getData() {
    const userCookies = cookies().get('token')

    if (!userCookies) {
        return redirect('/')
    }

    const res = await fetch(`${process.env.BACKEND_URL}/users`, {
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
    
    return await res.json();
}

export default async function Home({searchParams}: {searchParams: {q: string}}) {
    const users: User[] = await getData();

    let filteredUsers = users

    if (searchParams.q) {
        filteredUsers = filteredUsers.filter((user) => {
            return user['email'].toLowerCase().includes(searchParams.q.toLowerCase());
        });
    } else {
        filteredUsers = users;
    }

    return (
        <div className="container mt-8 mx-auto py-8 border border-gray-300 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
                <div></div>
                <Link
                href="/users/insertUser"
                className="mr-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Insert User
                </Link>
            </div>
            <SearchBar items={filteredUsers} endpoint='users' placeholder='by email'/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {filteredUsers && filteredUsers.map((user) => (
                    <UserCard key={user._id} user={user} />
                ))}
            </div>
        </div>
    );
}
  