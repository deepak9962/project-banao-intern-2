import axios from 'axios'

function getPosts(header) {
    return axios.get("http://localhost:8080/post", {
        headers: {
            'Authorization': 'Bearer ' + header
        }
    }).then(res => res.data)
}

function getStatus(header) {
    return axios.get("http://localhost:8080/post/status", {
        headers: {
            'Authorization': 'Bearer ' + header
        }
    }).then(res => res.data)
}

function postPost(data) {
    return axios.post("http://localhost:8080/post", data.data, {
        headers: {
            'Authorization': 'Bearer ' + data.header
        }
    }).then(res => res.data)
}

function putPost(data) {
    return axios.put("http://localhost:8080/post", data.data, {
        headers: {
            'Authorization': 'Bearer ' + data.header
        }
    }).then(res => res.data)
}

function deletePost(data) {
    return axios.delete("http://localhost:8080/post", data.data, {
        headers: {
            'Authorization': 'Bearer ' + data.header
        }
    }).then(res => res.data)
}

export { getPosts, getStatus, postPost, putPost, deletePost }