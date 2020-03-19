import axios from 'axios'

function getAxios() {
    return axios.create({
        baseURL: 'http://localhost:8000'
    })
}

export const getTasks = () => {
    return getAxios().get('tasks/')
}

export const addTask = description => {
    return getAxios().post('tasks/', {description})
}

export const updateTask = (task) => {
    return getAxios().patch(`tasks/${task.id}/`, task)
}