export type Task = {
    id: string,
    location: string,
    title: string,
    description: string,
    status: string,
    duration: number,
    creationDate: string,
    assignedTo: string
}

export type User = {
    id: string,
    name: string,
    email: string
}

export type  tasks = {
    data: Array<Task>,
    // task: Task | undefined,
    status: string,
    error: string | undefined
}

// export type  task = {
//     task: Task | undefined,
//     status: string,
//     error: string | undefined,
// }

export interface TasksState {
  tasks: {
    data: Array<Task>,
    task: Task,
    status: string,
    error: string
  }
}