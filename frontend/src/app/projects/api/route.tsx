import { Project } from "@/types/pages"
import { cookies } from 'next/headers'

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
        return new Response('Error');
    }

    if (!res.ok) {
        return new Response('Error');
    }

    return new Response(res);
  }