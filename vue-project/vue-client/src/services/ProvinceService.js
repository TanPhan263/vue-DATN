import axios from 'axios';
const url = 'http://KLTN.somee.com/api/Province';
const url2 = 'http://KLTN.somee.com/api/District';
export default{
    getAll(){
        return axios.get( url +'/GetAll').then(response => response.data);
    },
    getAllDistrict(){
        return axios.get( url2 +'/GetAll').then(response => response.data);
    }
}