import axios from 'axios';
const url='https://localhost:44398/api/Store';
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