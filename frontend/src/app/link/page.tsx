import { cookies } from 'next/headers'
import { User } from '@/types/pages';
import { redirect } from 'next/navigation';
import LinkedUserCard from "@/components/Cards/LinkedUserCard"
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';

async function getData() {
    // FIX 1: Await cookies() because it is now a Promise
    const cookieStore = await cookies();
    const userCookies = cookieStore.get('token');

    if (!userCookies) {
        return redirect('/')
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/users/linkedUsers`, {
            headers: {
                authorization: 'Bearer ' + userCookies.value
            },
            next: {
                revalidate: 0
            }
        });

        if (!res || !res.ok) {
            return redirect('/');
        }

        return await res.json();
    } catch (err) {
        return redirect('/');
    }
}

// FIX 2: searchParams is now a Promise in Next.js 15/16
export default async function Home({ 
    searchParams 
}: { 
    searchParams: Promise<{ q: string }> 
}) {
    const linkedUsers: string[] = await getData();
    
    // Await the searchParams before using them
    const params = await searchParams;
    const query = params.q;

    let filteredLinkedUsers = linkedUsers

    if (query) {
        filteredLinkedUsers = filteredLinkedUsers.filter((linkedUser) => {
            return linkedUser.toLowerCase().includes(query.toLowerCase());
        });
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
            <SearchBar items={filteredLinkedUsers} endpoint={'link'} placeholder='by email' />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ml-4">
                {filteredLinkedUsers && filteredLinkedUsers.map((linkedUser) => (
                    <LinkedUserCard key={linkedUser} email={linkedUser} />
                ))}
            </div>
        </div>
    )
}