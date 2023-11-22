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

export type History = {
  id: string,
  status: string,
  updateDate: string
}

export type historyList = {
  data: Array<History>,
  status: string,
  error: string | undefined
}

export type Notification = {
  taskId: string,
  read: boolean,
  title: string,
  message: string,
  task: string
}

export type notificationsList = {
  data: Array<Notification>,
  status: string,
  error: string | undefined
}

export interface notificationsState {
  notifications: {
    data: Array<Notification>,
    notification: Notification,
    status: string,
    error: string
  }
}

export type Updates = {
  id: string,
  title: string,
  description: string,
  time: string,
  images: Array<string>
}