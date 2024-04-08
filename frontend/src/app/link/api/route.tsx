import { UserInsertInfo } from '@/types/pages';
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const info: UserInsertInfo = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/users/linkUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token!.value
        },
        body: JSON.stringify(info),
    })

    if(!res) {
        return Response.json('Internal Server Error', {
            status: 500,
        });
    }

    if (!res.ok) {
        return Response.json({message: res.body}, {
            status: res.status,
        });
    }

    return new Response(res.statusText);
}