import axios from 'axios';
const url='https://api.viefood.info/api/Store';
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
    },
    getStorePerDistrict(id){
        return axios.get(url +'/ThongKeTheoQuan?ProvinceID='+ id).then(response => response.data);
    },
    getStorePerProvince(){
        return axios.get(url +'/ThongKeTheoTinh').then(response => response.data);
    },
    getAllView(){
        return axios.get(url +'/ThongKeView').then(response => response.data);
    },
    getStorePerBussinessType(){
        return axios.get(url +'/ThongKeTheoBusinessType').then(response => response.data);
    },
    getTotalViewOfStore(){
        return axios.get(url +'/ThongKeView').then(response => response.data);
    },
    addVisitView(){
        return axios.get(url +'/TangViewWebsite').then(response => response.data);
    }
    
}