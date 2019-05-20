import axios from 'axios';

// allows us to created a customised axios request
export default axios.create({
    baseURL: "http://localhost:5000/"
});