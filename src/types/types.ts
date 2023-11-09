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