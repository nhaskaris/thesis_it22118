import { cookies } from 'next/headers'
import { Wp } from '@/types/pages';
import { redirect } from 'next/navigation';
import WPCard from '@/components/Cards/WpCard';
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
    
    return await res.json();
}


export default async function Home({searchParams}: {searchParams: {q: string}}) {
    const wps: Wp[] = (await getData()).wps;

    let filteredWps = wps


    if (searchParams.q) {
        filteredWps = filteredWps.filter((wp) => {
            return wp['title'].toLowerCase().includes(searchParams.q.toLowerCase());
        });
    } else {
        filteredWps = wps;
    }

    return (
        <div className="container mt-8 mx-auto py-8 border border-gray-300 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
                <div></div>
                {/* <Link
                href="/users/insertUser"
                className="mr-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Insert Wp
                </Link> */}
            </div>
            <SearchBar items={filteredWps} endpoint='wps'/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {filteredWps && filteredWps.map((wp) => (
                    <WPCard key={wp._id} wp={wp} />
                ))}
            </div>
        </div>
    );
}
  