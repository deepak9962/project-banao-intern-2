import axios from 'axios'

export function postRegister(data) {
    return axios.post("http://localhost:8080/register", data).then(res => res.data)
}