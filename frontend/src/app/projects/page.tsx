import ProjectCard from "../../components/Cards/ProjectCard"
import { cookies } from 'next/headers'
import { Project } from '../../types/pages';
import { redirect } from 'next/navigation';
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import {GanttChart} from "@/components/GanttChart";
import { Task } from 'gantt-task-react';

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
    
    const data = await res.json();

    return data.projects;
}

export default async function Home({searchParams}: {searchParams: {q: string}}) {
    const projects: Project[] = await getData();
    
    let filteredProjects = projects;


    if (searchParams.q) {
        filteredProjects = filteredProjects.filter((project) => {
            return project['title'].toLowerCase().includes(searchParams.q.toLowerCase());
        });
    } else {
        filteredProjects = projects;
    }

    const tasks: Task[] = [];

    projects.forEach(project => {
        // from project.interval.duration calculate the end date
        const endDate = new Date(Number(project.interval.startDate));
        endDate.setMonth(endDate.getMonth() + project.interval.duration);
        tasks.push({
            id: project._id ?? '',
            name: project.title,
            start: new Date(Number(project.interval.startDate)),
            end: endDate,
            progress: 0, // progress is the difference between start and end date in days
            dependencies: project.wps.map(wps => wps.title),
            type: 'project',
            styles: {
                backgroundColor: '#3182ce',
                backgroundSelectedColor: '#2c5282',
            }
        });
    });

    return (
        <div className="container mt-8 mx-auto py-8 border border-gray-300 rounded-md shadow-md">
            <div className="flex justify-between mb-4">
                <div></div>
                <Link
                href="/projects/createProject"
                className="mr-8 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Create Project
                </Link>
            </div>
            <SearchBar items={filteredProjects} endpoint='projects' placeholder="by title"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                {filteredProjects && filteredProjects.length > 0 && filteredProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
            </div>
            {tasks.length > 0 && <GanttChart tasks={tasks} />}
        </div>
    );
}
  