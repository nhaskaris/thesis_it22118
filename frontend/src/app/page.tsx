import { cookies } from 'next/headers'
import { Project } from '../types/pages';
import SearchBar from "@/components/SearchBar";
import {GanttChart} from "@/components/GanttChart";
import { Task } from 'gantt-task-react';

async function getData() {
  const userCookies = cookies().get('token')

  if (!userCookies) {
      return null;
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
      return null;
  }

  if (!res.ok) {
      return null;
  }
  
  const data = await res.json();

  return data.projects;
}

export default async function Home({searchParams}: {searchParams: {q: string}}) {
  const projects: Project[] = await getData();

  if( projects === null) {
    return <main></main>
  }
  
  let filteredProjects = projects;

  if (searchParams.q) {
      filteredProjects = filteredProjects.filter((project) => {
          return project['title'].toLowerCase().includes(searchParams.q.toLowerCase());
      });
  } else {
      filteredProjects = projects;
  }

  const tasks: Task[] = [];

  filteredProjects.forEach(project => {
      // from project.interval.duration calculate the end date
      const endDate = new Date(Number(project.interval.startDate));
      endDate.setMonth(endDate.getMonth() + project.interval.duration);
      tasks.push({
          id: project._id ?? '',
          name: project.title,
          start: new Date(Number(project.interval.startDate)),
          end: endDate,
          progress: 0, // progress is the difference between start and end date in days
          dependencies: project.wps ? project.wps.map(wps => wps.title) : [],
          type: 'project',
          styles: {
              backgroundColor: '#3182ce',
              backgroundSelectedColor: '#2c5282',
          }
      });
  });

  return (
    <div>
      {/* add some space from header */}
      <div style={{height: '10px'}}></div>
      <SearchBar items={filteredProjects} endpoint='/' placeholder="by title"/>
      {tasks.length > 0 && <GanttChart tasks={tasks} />}
    </div>
  )
}
