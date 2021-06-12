import axios from 'axios';
const url='http://KLTN.somee.com/api/Store';
export default{
    getDate(ngay, thang, nam){
        return axios.get(url +'/ThongKeTheoNgayAll?ngay='+ngay+'&thang='+thang+'&nam='+nam).then(response => response.data);
    },
    getMonth(thang, nam){
        return axios.get(url +'/ThongKeTheoThangAll?thang='+thang+'&nam='+nam).then(response => response.data);
    },
    getYear(nam){
        return axios.get(url +'/ThongKeTheoNamAll?nam='+nam).then(response => response.data);
    },
    getDateStore(id,ngay, thang, nam){
        return axios.get(url +'/ThongKeTheoNgay?id='+id+'&ngay='+ngay+'&thang='+thang+'&nam='+nam).then(response => response.data);
    },
    getMonthStore(id,thang, nam){
        return axios.get(url +'/ThongKeTheoThang?id='+id+'&thang='+thang+'&nam='+nam).then(response => response.data);
    },
    getYearStore(id,nam){
        return axios.get(url +'/ThongKeTheoNam?id='+id+'&nam='+nam).then(response => response.data);
    }
}