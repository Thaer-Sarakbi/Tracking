export type Task = {
    id: string,
    title: string,
    description: string,
    status: string,
    duration: number,
    creationDate: {
      _seconds: number
    }, 
    assignedTo: string,
    assignedBy: string,
    assigenId: string,
    latitude: string,
    longitude: string,
    location: string,
    deviceToken: string | undefined
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
  deviceToken: string,
  latitude: number,
  longitude: number
}

export interface Message  {
  id?: any,
  comment: string,
  commenter: string,
  creationDate: {
    seconds: number
  }
}

export interface UserState {
  users: {data: Array<User>},
  auth: {user: User}
}

export interface ListsProps {
  tasks: Task[],
  status: string,
  users: User[],
  navigation: {navigate: (screen: string, task: Task) => void}
}