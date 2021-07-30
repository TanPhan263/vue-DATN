import axios from 'axios';
const url='https://api.viefood.info/api/Store';
export default{
    //api lấy dữ liệu thống kê theo ngày của website
    getDate(ngay, thang, nam){
        return axios.get(url +'/ThongKeTheoNgayAll?ngay='+ngay+'&thang='+thang+'&nam='+nam).then(response => response.data);
    },
    //api lấy dữ liệu thống kê theo tháng của website
    getMonth(thang, nam){
        return axios.get(url +'/ThongKeTheoThangAll?thang='+thang+'&nam='+nam).then(response => response.data);
    },
     //api lấy dữ liệu thống kê theo năm của website
    getYear(nam){
        return axios.get(url +'/ThongKeTheoNamAll?nam='+nam).then(response => response.data);
    },
    //api lấy dữ liệu thống kê theo ngày của quán
    getDateStore(id,ngay, thang, nam){
        return axios.get(url +'/ThongKeTheoNgay?id='+id+'&ngay='+ngay+'&thang='+thang+'&nam='+nam).then(response => response.data);
    },
    //api lấy dữ liệu thống kê theo tháng của quán
    getMonthStore(id,thang, nam){
        return axios.get(url +'/ThongKeTheoThang?id='+id+'&thang='+thang+'&nam='+nam).then(response => response.data);
    },
    //api lấy dữ liệu thống kê theo năm của quán
    getYearStore(id,nam){
        return axios.get(url +'/ThongKeTheoNam?id='+id+'&nam='+nam).then(response => response.data);
    },
    //api thống kê quán theo quận
    getStorePerDistrict(id){//id tỉnh
        return axios.get(url +'/ThongKeTheoQuan?ProvinceID='+ id).then(response => response.data);
    },
    //api thống kê quán theo tỉnh
    getStorePerProvince(){
        return axios.get(url +'/ThongKeTheoTinh').then(response => response.data);
    },
    //api lấy tổng view của website
    getAllView(){
        return axios.get(url +'/ThongKeView').then(response => response.data);
    },
    //thống kê quán theo loại quán
    getStorePerBussinessType(){
        return axios.get(url +'/ThongKeTheoBusinessType').then(response => response.data);
    },
    //api tăng view cho website khi người dùng vào trang web 
    addVisitView(){
        return axios.get(url +'/TangViewWebsite').then(response => response.data);
    }
    
}