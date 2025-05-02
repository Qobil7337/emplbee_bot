import axios from 'axios'
const api = axios.create({
    baseURL: process.env.DEV_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`
    }
})

export default api
