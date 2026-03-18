import { InsertInfo } from '@/types/pages';
import { cookies } from 'next/headers';

export async function DELETE(request: Request) {
    // Next.js 15: cookies() is now an async function
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/${json.endpoint}/${json.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer ' + token.value
            }
        });

        if (!res.ok) {
            return Response.json(res.statusText, { status: res.status });
        }

        return new Response(res.body, { status: res.status });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const info: InsertInfo = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/users/insertInfo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token.value
        },
        body: JSON.stringify(info),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return Response.json(errorData.message || res.statusText, { status: res.status });
    }

    return new Response(res.statusText);
}

export async function PATCH(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const info: InsertInfo = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/users/updateInfo`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token.value
        },
        body: JSON.stringify(info),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return Response.json(errorData.message || res.statusText, { status: res.status });
    }

    return new Response(res.statusText);
}

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
        return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${process.env.BACKEND_URL}/users/getProfile`, {
        method: 'POST', // Note: Keeping your original POST logic here
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + token.value
        }
    });

    if (!res.ok) {
        return Response.json({ message: "Failed to fetch profile" }, { status: res.status });
    }

    // Usually you want to return the JSON data for a GET request
    const data = await res.json();
    return Response.json(data);
}