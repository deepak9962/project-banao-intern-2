import axios from 'axios'

function postLogin(data) {
    return axios.post("http://192.168.200.18:8080/login" , data, {
        validateStatus: function (status) {
            return (status >= 200 && status < 300) || status === 302
        }
    }).then(res => res.data)
}

function postRT(data) {
    return axios.post("http://localhost:8080/login/rt", data).then(res => res.data)
}

export { postLogin, postRT }