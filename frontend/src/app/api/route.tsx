import { InsertInfo } from '@/types/pages';
import { cookies } from 'next/headers'


export async function DELETE(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const json = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/${json.endpoint}/${json.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token!.value
        }
    }).catch(err => {
        return err.statusText;
    });

    if(!res) {
        return Response.json(res, {
            status: 500,
        });
    }

    if (!res.ok) {
        return Response.json(res.statusText, {
            status: 500,
        });
    }

    return new Response(res);
}

export async function POST(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const info: InsertInfo = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/users/insertInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token!.value
        },
        body: JSON.stringify(info),
    })

    if(!res) {
        return Response.json(res, {
            status: 500,
        });
    }

    if (!res.ok) {
        const message = JSON.parse(await res.text()).message;
        return Response.json(message, {
            status: res.status,
        });
    }

    return new Response(res.statusText);
}

export async function PATCH(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const info: InsertInfo = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/users/updateInfo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token!.value
        },
        body: JSON.stringify(info),
    })

    if(!res) {
        return Response.json(res, {
            status: 500,
        });
    }

    if (!res.ok) {
        const message = JSON.parse(await res.text()).message;
        return Response.json(message, {
            status: res.status,
        });
    }

    return new Response(res.statusText);
}

export async function GET() {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const res = await fetch(`${process.env.BACKEND_URL}/users/getProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token!.value
        }
    })

    if(!res) {
        return Response.json(res, {
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