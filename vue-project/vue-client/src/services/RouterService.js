import router from '../router/index';
export default{
    storeClicked(item){
        return router.push('/'+item);
    },
    dishClicked(item){
        router.push('/search?key='+ item)
    },
    viewMore(id){
        router.push('/viewmore?key=' + id).catch(()=>{});
    },
    dishViewMore(){
        return router.push('/dishtype');
    },
    viewMore_Search(index){
       return this.$router.push('/search?key=' + index).catch(()=>{});
    },
    onSearchClicked(keyword){
        this.$router.push('/search?key=' + keyword).catch(()=>{});
    },
}