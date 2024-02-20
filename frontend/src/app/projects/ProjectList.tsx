import { cookies } from 'next/headers'
import { Project } from '../types/pages';

export async function getData() {
    const userCookies = cookies().get('token')

    if (!userCookies) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    const res = await fetch('http://localhost:8080/users/getProfile', {
        headers: {
            authorization: 'Bearer ' + userCookies.value!
        }
    }).catch(err => {
        return err.statusText;
    })

    if (!res.ok) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }
    
    const data = await res.json();

    return data.projects;
}

export default async function ProjectList() {
    const projects: Project[] = await getData()

    return (
        <div>
            {projects.map((project) => (
                <div key={project.id}>
                    <h1>{project.title}</h1>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    )
}