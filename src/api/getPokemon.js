import axios from 'axios'

function getPokemon(data, cancel) {
    return axios.get(data.url, {
        cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => res.data)
}

export { getPokemon }