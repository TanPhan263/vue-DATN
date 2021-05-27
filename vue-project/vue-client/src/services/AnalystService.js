import axios from 'axios';
const url='http://tlcnwebapi-dev.us-west-2.elasticbeanstalk.com/api/Store';
export default{
    getDate(ngay, thang, nam){
        return axios.get(url +'/ThongKeTheoNgayAll?ngay='+ngay+'&thang='+thang+'&nam='+nam).then(response => response.data);
    },
    getMonth(thang, nam){
        return axios.get(url +'/ThongKeTheoThangAll?thang='+thang+'&nam='+nam).then(response => response.data);
    },
    getYear(nam){
        return axios.get(url +'/ThongKeTheoNamAll?nam='+nam).then(response => response.data);
    }
}