import axios from 'axios'

const http = axios.create({
    // baseURL: "http://localhost",
    baseURL: "https://psyop.guru",
    timeout: 1000 * 180,
    withCredentials: false,
});

export default http
//process.env.DOMAIN
