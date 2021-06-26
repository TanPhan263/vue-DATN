import router from '../router/index';
export default{
    storeClicked(item){
        return router.push('/'+item);
    },
    dishClicked(item){
        return router.push('/search?key='+ item);
    },
    viewMore(id){
        return router.push('/viewmore?key=' + id).catch(()=>{});
    },
    dishViewMore(){
        return router.push('/dishtype');
    },
    viewMore_Search(index){
       return router.push('/search?key=' + index).catch(()=>{});
    },
    onSearchClicked(keyword){
        return router.push('/search?key=' + keyword).catch(()=>{});
    },
}