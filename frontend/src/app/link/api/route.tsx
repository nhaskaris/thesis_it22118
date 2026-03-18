import { UserInsertInfo } from '@/types/pages';
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    // FIX: cookies() is an async function in Next.js 15/16
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    // Safety check to avoid crashing on token!.value if cookie is missing
    if (!token) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const info: UserInsertInfo = await request.json();

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/users/linkUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token.value
            },
            body: JSON.stringify(info),
        })

        if (!res.ok) {
            // Note: res.body is a stream, usually better to send statusText 
            // or a parsed JSON error message.
            return Response.json({ message: res.statusText }, {
                status: res.status,
            });
        }

        return new Response(res.statusText, { status: res.status });
        
    } catch (error) {
        return Response.json({ message: 'Internal Server Error' }, {
            status: 500,
        });
    }
}