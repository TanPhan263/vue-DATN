import router from '../router/index';
export default{
    storeClicked(item){//đi đến trang chi tiết quán
        return router.push('/'+item);
    },
    dishClicked(item){//đến trang timg kiếm 
        return router.push('/search?key='+ item);
    },
    viewMore(id){//đến trang xem thêm 
        return router.push('/viewmore?key=' + id).catch(()=>{});
    },
    dishViewMore(){//đến trang xem thêm món ăn
        return router.push('/dishtype');
    },
    viewMoreGantoiDanhgiacao(index){//đến trang tìm kiếm chế độ Gần tôi đánh giá cao
       return router.push('/search?key=' + index).catch(()=>{});
    },
    onSearchClicked(keyword){//đến trang tìm kiếm với keyword
        return router.push('/search?key=' + keyword).catch(()=>{});
    },
}