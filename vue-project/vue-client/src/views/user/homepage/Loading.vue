<template>
  <ul>
        <li v-for="(store, index ) in array" v-bind:key="index"  style="position: relative;">
        <a style="height: 100%">
            <img src="../../../assets/imgs/error.png"/>
            <div class="store-contain">
            <div class="store-name animated-background"></div>
            <div class="store-address animated-background"></div>
            <div class="store-rate animated-background"></div>
            <div class="intro"></div>
            </div>
            </a>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'loadingComponent',
    props:{
        storeNumber: Number
    },
    data(){
        return{
            array:[]
        }
    },
    mounted(){
        for (let i = 0 ; i < this.storeNumber ; i++)
        {
            this.array.push(i);
        }
    }
}
</script>

<style scoped>
.image{
    text-decoration:none; 
	display:block; 
	white-space:nowrap;  
	color:#000;
	border-radius: 15px;
	cursor: pointer;
	background-color:#fff;
	box-shadow: 2px 2px 2px #AAA;
    height: 16em;
}
.store-contain{
    padding: 0 0 0 15px;
}   
 .store-name{
    width: 80%;
 }
  .store-address{
    width: 90%;
 }
  .store-rate{
    width: 50%;
 }
@keyframes placeHolderShimmer{
    0%{
        background-position: -468px 0
    }
    100%{
        background-position: 468px 0
    }
}

.animated-background {
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderShimmer;
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%);
    background-size: 800px 104px;
    height: 15px;
    position: relative;
    margin-bottom: 5px;
}
</style>