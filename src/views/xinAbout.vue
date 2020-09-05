<template>
	<div>
		<img alt="寒舍" class="top" id="about" :src="banner">
		<div class="wrapper">
			<div class="left">
				<a-anchor wrapperClass="anchor">
					<a-anchor-link :href="'#'+item.eng" :title="item.title" v-for="(item,idx) of list" :key="idx" />
				</a-anchor>
				<ul class="news">
					<li class="item" @click="router(4)">集团新闻</li>
					<li class="item" @click="router(5)">集团活动</li>
				</ul>
			</div>
			<div class="right">
				<div class="htm-box" id="html" v-html="html"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				img1: require('@/assets/img/boss.png'),
				banner: '',
				list: [{
					title: '关于我们',
					eng: 'about'
				}],
				activeLink: 0,
				html: "",
			};
		},
		async mounted() {
			let {
				data
			} = await this.$axios.post('/api/getBanner?sequence=9')
			this.banner = this.imgUrl + data.data.picture

			let htmlData = await this.$axios.get('api/about/getAbout')
			let text = document.getElementById('html')
			this.html = htmlData.data.data.content
			this.$nextTick(function () {
				this.setNodeStyle(text)
			})
		},
		methods: {
			router(type) {
				this.$router.push({
					path: '/news',
					query: {
						type
					}
				});
			},
			setNodeStyle(node) {
				if (node.children.length > 0) {
					for (let i = 0; i < node.children.length; i++) {
						if (node.children[i].nodeName == 'P' || node.children[i].nodeName == 'SPAN') {
							node.children[i].style.fontFamily = "gongyeMin"
							node.children[i].addClass = "title"
						} else if (node.children[i].nodeName == 'IMG') {
							if (node.children[i].alt.indexOf("honor") != -1) {
								node.children[i].style.width = "100%"
							}
						}
						this.setNodeStyle(node.children[i])
					}
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	@import "../assets/less/common";

	.news {
		.item {
			border-left: 3px solid #ececec;
			border-bottom: 1px solid #f2f2f2;
			border-right: 1px solid #f2f2f2;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 50px;
			cursor: pointer;

			&:hover {
				color: #a3999a;
			}
		}
	}

	@media screen and (max-width: 1000px) {
		.wrapper {
			display: flex !important;
			width: 100% !important;
			padding: 0 50px;
			box-sizing: border-box;

			.right {
				flex: 1;
			}

			/deep/ .ant-anchor-link {
				width: fit-content !important;
				padding: 20px 50px !important;
			}

			
		}
	}

	.top {
		width: 100%;
	}

	.wrapper {
		display: flex;
		font-size: 16px;
		margin: 70px auto 100px;
		width: 70%;

		.left {
			margin-right: 44px;
			height: 260px;
			position: sticky;
			top: 40px;

			/deep/ .anchor {
				overflow: hidden !important;
				font-family: "gongyeMin"!important;

				.ant-anchor-link {
					width: 180px;
					border: 1px solid #f2f2f2;
					font-size: 16px;
					text-align: center;
					padding: 14px 0;
				}

				.ant-anchor-link-active {
					border-left: 4px solid @color;
					background-color: #EBEDF2;
					font-weight: bold;
					color: @color;
				}
			}

		}

		.right {
			color: @color;
			widows: 40%;

			.title {
				font-size: 22px;
				font-weight: bold;
				line-height: 31px;
				margin-top: 50px;
			}

			.title:first-child {
				margin-top: 0px;
			}

			.middle {
				font-size: 18px;
				font-weight: bold;
				margin: 0px 0 8px;
			}

			.content {
				font-size: 16px;
				font-weight: 500;
				line-height: 30px;
				padding: 0;
				margin: 0;
			}


		}
	}

	.ant-anchor-ink {
		display: none !important;
	}
</style>