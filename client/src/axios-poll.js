import axios from 'axios';

const instance = axios.create({
    baseURL: "https://voting-app-.glitch.me/" //`http://localhost:5000/`
});

export default instance;