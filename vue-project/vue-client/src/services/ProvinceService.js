import axios from 'axios';
const url = 'https://localhost:44398/api/Province';
const url2 = 'https://localhost:44398/api/District';
export default{
    getAll(){
        return axios.get( url +'/GetAll').then(response => response.data);
    },
    getAllDistrict(){
        return axios.get( url2 +'/GetAll').then(response => response.data);
    }
}