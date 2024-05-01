'use client'

import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

export const GanttChart = ({tasks}: {tasks: Task[]}) => {
    const stylingOption: StylingOption = {
        headerHeight: 50,
        columnWidth: 70,
        listCellWidth: '200px',
        rowHeight: 50,
        barCornerRadius: 3,
        handleWidth: 5,
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        barFill: 60,
        projectBackgroundColor: '#3182ce',
        projectBackgroundSelectedColor: '#2c5282',
        milestoneBackgroundColor: '#805ad5',
        milestoneBackgroundSelectedColor: '#6b46c1',
        arrowColor: '#4299e1',
        arrowIndent: 10,
        todayColor: '#f56565',
        TaskListTable: ({ tasks, selectedTaskId, setSelectedTask }) => {
            return (
              <div>
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task.id)}
                    className={`cursor-pointer ${task.id === selectedTaskId ? 'bg-gray-700' : 'bg-gray-800'} p-2`}
                    style={{ outline: '1px solid white', marginBottom: '1px' }}
                  >
                    <div className="flex justify-between">
                      <div>{task.name}</div>
                      <div>{task.start.toDateString()}</div>
                      <div>{task.end.toDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          
      };

    return (
        <div className="mt-8 mx-4">
            <div className="border rounded-lg shadow-lg p-4 bg-gray-800">
                <Gantt 
                tasks={tasks} 
                {...stylingOption}
                />
            </div>
        </div>
    );
}