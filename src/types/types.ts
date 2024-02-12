export type Task = {
    id: string,
    location: string,
    title: string,
    description: string,
    status: string,
    duration: number,
    creationDate: string,
    assignedTo: string,
    assigenId: string
}

export type User = {
    id: string,
    name: string,
    email: string,
    password: string,
    admin: boolean,
    mobile: string,
    creationDate: string,
    deviceToken: string,
    value: string
}

export type  tasks = {
    data: Array<Task>,
    status: string,
    error: string | undefined
}

export interface TasksState {
  tasks: {
    data: Array<Task>,
    task: Task,
    status: string,
    error: string
  },
  auth: {user: User}
}

export type History = {
  id: string,
  status: string,
  updateDate: {
    seconds: number
  },
  updatedBy: string
}

export type historyList = {
  data: Array<History>,
  status: string,
  error: string | undefined
}

export type Notification = {
  item : {
    id: string,
    taskId: string,
    read: boolean,
    title: string,
    message: string,
    task: string,
    creationDate: {
      seconds: number
    },
    screen: string
  }
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
  },
  auth: {user: User}
}

export type Updates = {
  updateId: string,
  assigenId: string, 
  description: string, 
  images: Array<string>, 
  taskId: string, 
  time: {
    seconds: number
  }, 
  title: string,
  updatedBy: string,
  deviceToken: string
}

// export type UpdatesList = {
//   assigenId: string, 
//   description: string, 
//   images: Array<string>, 
//   taskId: string, 
//   time: Date, 
//   title: string, 
//   updateId: string, 
//   updatedBy: string
// }

export type message = {
  id: string,
  comment: string,
  commenter: string,
  creationDate: {
    seconds: number
  }
}