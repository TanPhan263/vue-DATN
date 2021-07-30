<template>
  <div>
      <div v-on:click="storeClicked(result.storeID)" href="" class="search_suggest" v-for="result in results" v-bind:key="result.storeID" style="
    text-align: left; display: flex; border-bottom: 1px solid darkgray;cursor: pointer;padding: 4px; border-radius: 0px">
      <img :src="result.storePicture" class="left-thing" style="border-radius:5px;">
      <div class="middle-thing" style="margin-left: 3px; height: 100%">
        <p style="margin-top: 0px; height: 15%; font-weight: bold;">{{result.storeName}}</p>
        <p style="margin-top: 0px;">{{result.storeAddress}}</p>
      </div>
      <div v-if="getActiveTime(result.openTime,result.cLoseTime)" class="right-thing" style="padding-right: 15px">
        <p style="font-size: 12px;margin-top: 0px; height: 15%; color:green;">Đang hoạt động <span class="dot"></span></p>
        <p style="color: #585858;" >{{result.khoangcach}} km</p>
      </div>
      <div v-else class="right-thing" style="padding-right: 15px">
        <p style="margin-top: 0px; height: 20%; color:red;">Đóng cửa <span class="dot" style="background-color:#FF0000;"></span></p>
        <p >{{result.khoangcach}} km</p>
    </div>
  </div>
</div>
</template>

<script>
export default {
    props: {
        results: Array                                      //biến nhận vào là danh sách quán 
    },
    created(){
      this.$root.$refs.Suggest = this;                      //khai báo để sử dụng ở các component khác 
    },
    methods:{
        storeClicked: function(Id){                         //đi đến trang chi tiết quán
          this.$emit('click-store', Id);
        },                                                
        subString(index){                                   //hàm cắt chuỗi nếu quá dài
          return index.toString().substring(0,40);
        },
        getActiveTime(open,close){                         //hàm kiểm tra quán có trong thời gian hoạt động hay không 
          const today = new Date();
          const hour = today.getHours();
          const min = today.getMinutes();
          let openHour = parseInt((open+'').substring(0,2));
          let openMin = parseInt((open+'').substring(3,5));
          let closeHour = parseInt((close+'').substring(0,2));
          let closeMin = parseInt((close+'').substring(3,5));
          if( openHour < hour && hour < closeHour)
              return true;
          else if( hour == closeHour && min < closeMin)
              return true;
          else if(hour == openHour && min >= openMin)
              return true;
          else return false;
        },
    }
}
</script>
<style>
</style>