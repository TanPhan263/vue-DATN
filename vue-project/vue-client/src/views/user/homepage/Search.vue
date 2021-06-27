<template>

</template>
<script>

export default {
	name: 'search',
	components: { VueperSlides, VueperSlide },
	data(){
		return{
			item: {},
			itemTemplate,
			slides: [
				{
				title: 'Slide #1',
				content: 'Slide content.'
				}
			]
		}
	},
	props:{
		type:Array
	},
	mounted(){

	},
	methods: {
  },
}
</script>
<script>

</script>
<style>
@import url('../../../assets/css/reset.css');
</style>