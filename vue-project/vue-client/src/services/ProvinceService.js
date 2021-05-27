import axios from 'axios';
const url = 'http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/Province';
const url2 = 'http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/District';
export default{
    getAll(){
        return axios.get( url +'/GetAll').then(response => response.data);
    },
    getAllDistrict(){
        return axios.get( url2 +'/GetAll').then(response => response.data);
    }
}