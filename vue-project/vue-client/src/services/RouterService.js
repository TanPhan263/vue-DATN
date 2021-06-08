import router from '../router/index';
export default{
    storeClicked(item){
        router.push({path: `/storeDetail/${item}`})
    },
    dishClicked(item){
        router.push('/search?key='+ item)
    },
    viewMoreClicked(id){
        router.push('/ViewMore?key=' + id).catch(()=>{});
    },
    dishViewMore(){
        return router.push('/DishType');
    },
    viewMore_Search(index){
       return this.$router.push('/search?key=' + index).catch(()=>{});
    },
    onSearchClicked(){
        localStorage.setItem("keyword", this.keyword);
        this.$router.push('/search?key=' + this.keyword).catch(()=>{});
    },
}