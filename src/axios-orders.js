import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://react-my-burger-b9ddb.firebaseio.com/'
});


export default instance;