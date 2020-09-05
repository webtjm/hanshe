<template>
	<div>
		<img alt="寒舍" class="top" id="about" :src="banner">
		<div class="wrapper">
			<div v-html="html"></div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				banner: "",
				html: ""
			}
		},
		async mounted() {
			let {
				data
			} = await this.$axios.post('/api/getBanner?sequence=9')
			this.banner = this.imgUrl + data.data.picture
			
			var id = this.$route.query.id
			this.getDetail(id)
		},
		methods: {
			async getDetail(id){
				let {
					data
				} =  await this.$axios.get(`/api/article/view?id=${id}`)
				this.html = data.data[0].content
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "../assets/less/common";
	.top {
		width: 100%;
	}
	.wrapper{
		width: 66%;
		margin: 0 17%;
		padding: 80px 0;
	}
</style>
