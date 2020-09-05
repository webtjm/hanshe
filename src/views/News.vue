<template>
	<div>
		<img alt="寒舍" class="top" id="about" :src="banner">
		<div class="wrapper">
			<div class="lanmuName">
				<span>集团{{type==4?'新闻':'活动'}}</span>
				<span>Events</span>
			</div>
			<div class="box" v-for="(item, idx) in list" :key="idx">
				<img alt="寒舍" :src="imgUrl+item.cover" />
				<div>
					<div class="detail">
						<div class="title">{{item.title}}</div>
						<div class="desc">{{item.introduction}}</div>
					</div>
					<div class="detailBtn" @click="linkTo(item.id)">
						详情
						<div class="en">details</div>
					</div>
				</div>
			</div>
			<a-pagination showQuickJumper :defaultPageSize="size" :defaultCurrent="page" :total="total" @change="onChange" />
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				type: 0,
				banner: '',
				size: 5,
				page: 1,
				total: 0,
				list: []
			};
		},
		async mounted() {
			this.type = this.$route.query.type
			let {
				data
			} = await this.$axios.post('/api/getBanner?sequence=9')
			this.banner = this.imgUrl + data.data.picture
			
			this.getData()
		},
		methods: {
			linkTo(id){
				this.$router.push({
				    path: '/newDetail',
				    query: {
				       id
				    }
				});
			},
			async getData() {
				var params = {
					page: this.page,
					size: this.size,
					type: this.type
				}
				this.$axios.get(`/api/article/findAll`, {params})
					.then(({
						data
					}) => {
						if (data.errcode === 0) {
							this.list = data.data.records
							this.total = data.data.total
						} else {
							this.$message.info(data.errmsg);
						}
					}).catch(err => {
						this.$message.info('服务器出错了')
					})

			},
			onChange(page) {
				this.page = page;
				this.getData();
			}
		}
	};
</script>

<style lang="less" scoped>
	@import "../assets/less/common";

	.top {
		width: 100%;
	}

	.lanmuName {
		width: 100%;
		margin: 60px 0;
		display: flex;
		flex-flow: column;
		justify-content: center;

		span {
			font-size: 30px;
			color: @color;
			line-height: 40px;
			display: flex;
			justify-content: center;
		}
	}

	.box {
		width: 66%;
		display: flex;
		margin: 0 auto;
		margin-top: 45px;

		img {
			width: 482px;
			height: 254px;
			object-fit: cover;
			border-radius: 8px;
		}

		&>div {
			display: flex;
			align-items: center;
			flex: 1;

			.detail {
				flex: 1;
				color: @color;
				margin: 0 43px;

				.title {
					font-size: 24px;
					color: @color;
				}

				.desc {
					font-size: 16px;
					font-weight: 500;
					color: @color;
					opacity: 0.7;
					margin-top: 20px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 6;
					overflow: hidden;
				}
			}

			.detailBtn {
				height: 254px;
				cursor: pointer;
			}
		}
	}
</style>
