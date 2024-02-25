import { InsertInfo } from '@/types/pages';
import { cookies } from 'next/headers'


export async function DELETE(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const json = await request.json();

    const res = await fetch(`http://localhost:8080/${json.endpoint}/${json.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token!.value
        }
    }).catch(err => {
        return err.statusText;
    });

    if(!res) {
        return new Response(res, {
            status: 500,
        });
    }

    if (!res.ok) {
        return new Response(res.statusText), {
            status: 500,
        };
    }

    return new Response(res);
}

export async function POST(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const info: InsertInfo = await request.json();

    const res = await fetch('http://localhost:8080/users/insertInfo', {
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
        return Response.json({message: res.body}, {
            status: res.status,
        });
    }

    return new Response(res.statusText);
}