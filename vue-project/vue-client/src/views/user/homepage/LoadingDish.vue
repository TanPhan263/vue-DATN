<template>
  <ul>
    <li v-for="(index) in array" v-bind:key="index" style="height:90px;width:100px;">
    <a class="animated-background" style="border-radius:10px 10px 10px 10px; width:102px; height:90px;cursor: pointer; border:none">    
    </a>
    </li>
    </ul>
</template>

<script>
export default {
     //Component loading khi đang tải các món ăn
    name: 'loadingComponent',
    data(){
        return{
            array:[]
        }
    },
    mounted(){
        for (let i = 0 ; i < 10 ; i++)
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