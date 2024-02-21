import ProjectCard from "../../components/ProjectCard"
import { cookies } from 'next/headers'
import { Project } from '../../types/pages';
import { redirect } from 'next/navigation';
import AddNewButton from '../../components/Modal'


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
        },
        next: {
            revalidate: 60 * 1
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
    
    const data = await res.json();

    return data.projects;
}

export default async function Home() {
    const projects: Project[] = await getData(); // Your function to fetch projects data

    return (
        <div className="container mx-auto py-8">
            <AddNewButton />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
                ))}
            </div>
        </div>
    )
}
  