import { Project } from "@/types/pages"
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const project: Project = (await request.json()) as unknown as Project;

    const obj = {
        "project": project,
    }
    const res = await fetch('http://localhost:8080/users/insertInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token!.value
        },
        body: JSON.stringify(obj),
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

  export async function DELETE(request: Request) {
    const cookieStore = cookies()
    const token = cookieStore.get('token')

    const id = ((await request.json()) as unknown as {id: string}).id;

    const res = await fetch(`http://localhost:8080/projects/${id}`, {
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