import { cookies } from 'next/headers'
import { Contract, User } from '@/types/pages';
import { redirect } from 'next/navigation';
import Link from "next/link";
import ContractCard from '@/components/Cards/ContractCard';
import SearchBar from '@/components/SearchBar';

async function getData() {
    // FIX 1: Await cookies()
    const cookieStore = await cookies();
    const userCookies = cookieStore.get('token');

    if (!userCookies) {
        return redirect('/');
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/users/getProfile`, {
            // Note: Your route handler used POST, but Server Components 
            // usually use GET. Keeping your logic as is.
            headers: {
                authorization: 'Bearer ' + userCookies.value
            },
            next: {
                revalidate: 0
            }
        });

        if (!res || !res.ok) {
            redirect('/');
        }

        return await res.json();
    } catch (err) {
        redirect('/');
    }
}

// FIX 2: In Next.js 15, searchParams is a Promise
export default async function Home({ 
    searchParams 
}: { 
    searchParams: Promise<{ q: string }> 
}) {
    const data: User = await getData();
    const params = await searchParams; // Await the params here
    const query = params.q;

    let filteredContracts = data.contracts;

    if (query) {
        filteredContracts = filteredContracts.filter((contract) => {
            return contract['_id']?.toLowerCase().includes(query.toLowerCase());
        });
    }

    return (
        <div className="container mt-8 mx-auto py-8 border border-gray-300 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
                <div />
                <Link
                    href={{
                        pathname: "/contracts/createContract",
                        query: {
                            humans: JSON.stringify(data.humans),
                            projects: JSON.stringify(data.projects)
                        }
                    }}
                    className="mr-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Contract
                </Link>
            </div>
            <SearchBar items={filteredContracts} endpoint='contracts' placeholder='by id' />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {filteredContracts && filteredContracts.map((contract) => (
                    <ContractCard key={contract._id} contract={contract} />
                ))}
            </div>
        </div>
    );
}