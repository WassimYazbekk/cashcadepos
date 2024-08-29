import axios from 'axios'
const http = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_SERVER_URL + 'api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
export default http
