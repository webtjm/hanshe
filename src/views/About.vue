<template>
	<div>
		<img alt="寒舍" class="top" id="about" :src="banner">
		<div class="wrapper">
			<div class="left">
				<a-anchor wrapperClass="anchor">
					<a-anchor-link :href="'#'+item.eng" @click="anchorClick" :title="item.title" v-for="(item,idx) of list" :key="idx" />
				</a-anchor>
				<ul class="news">
					<li class="item" @click="router(4)">集团新闻</li>
					<li class="item" @click="router(5)">集团活动</li>
				</ul>
			</div>
			<div class="right">
				<div class="title">关于寒舍</div>
				<div class="middle">寒舍旅游投资管理集团有限公司介绍</div>
				<p>寒舍旅游投资管理集团有限公司（以下简称寒舍文旅集团）作为国内领先的文旅产业投资管理平台、文旅产业投资运营专家，是国有四大资管集团东方资产旗下成员单位：</p>
				<p>国内首家得到央企投资的文旅企业，拥有雄厚的资金实力，能为优秀项目提供融资平台；</p>
				<p>与全球泛文旅行业最高端学府——瑞士洛桑酒店管理学院共同成立同里洛桑实训学院，具有强大的高端人才输出能力，并引入SOP、KPI 标准化管理；</p>
				<p>曾与首旅集团共同成立首旅寒舍，拥有诸多成功运营案例，具有强大的运维能力。经过十年经营，2008 年至今寒舍中央预订系统已沉淀了百万余忠实客户，并与红树林度假酒店共享会员资源，具有强大的客户导流能力。</p>
				<p>简称寒舍文旅集团具有国际化视野，是国际最大度假酒店交换平台Interval International 成员( 成员单位有万豪、喜达屋、喜来登、四季、安娜塔拉等3000 家知名酒店），2017
					年加入世界顶级小型奢华酒店联盟SLH（中国仅有四家顶级酒店入围）拥有强大境外旅游度假交换系统资源。</p>
				<div class="middle">发展里程碑</div>
				<li>2008年寒舍集团与搜狐集团共同创建“寒舍·搜狐农场”</li>
				<li>2009年成立北京大型连锁便利超市366 都市农场。</li>
				<li>2010年旗下北京山里逸居正式营业。</li>
				<li>2011年开发山里乐活系列项目。</li>
				<li>2012年创建寒舍·山里有机超市 。</li>
				<li>2013年旗下北京山里寒舍大型田园综合体项目正式营业。</li>
				<li>2014年投资创建“山里寒舍”项目。干峪沟村因 山里寒舍项目荣获国家农业部颁发中国最美休闲乡村称号。</li>
				<li>2015年与首旅集团共同创建“北京首旅寒舍酒店管理有限公司”与苏州市吴江区政府合作共同打造古镇项目，版图扩张至长三角地区。</li>
				<li>2016年旗下精品酒店加入Interval International。旗下项目加入全球奢华精品酒店联盟(SLH)。与红树林签署合作协议。与富力集团在海南正式展开文旅项目合作。</li>
				<li>2017年获得中国东方资产管理股份有限公司的强力注资。与全球泛文旅行业最高端学府瑞士洛桑酒店管理学院共同成立实训学院。与绿地集团在天津正式展开文旅项目合作。</li>
				<li>2018年进入快速扩张阶段，旗下湖畔寒舍、同里米仓等30
					多个项目进入建设期。深度打造客家客侨文化，标志集团版图扩张至珠三角地区。与吉林省辉南政府共同打造金川特色小镇。与阜平县委、县政府签约，倾力打造阜平全域旅游。国内最大帐篷集群于十月亮相京城。与京东共同打造京东寒舍。</li>
				<li>2019年河北骆驼湾、顾家台、瓦窑、森林驿站等六店同期靓丽绽放；与天津宁河区委、区政府签约倾力打造全域旅游小镇；湖北竹溪项目盛装开业。</li>
				<div class="title" id="say">创始人说</div>
				<div class="imgContent">
					<div class="imgBox">
						<img alt="寒舍" src="@/assets/img/boss.png">
					</div>

					<div>
						<div>
							<span class="name">殷文欢</span>
							<span>寒舍旅游投资管理集团有限公司创始人＆总裁</span>
						</div>
						<div class="honor">
							<div>中国高端旅游十大人物</div>
							<div>北京市劳动模范</div>
							<div>中国饭店协会文旅委员会执行主席(负责行业内民宿客栈评级，及行业标准的制定</div>
						</div>

					</div>
				</div>
				<div class="imgContent">
					<div class="imgBox">
						<img alt="寒舍" src="@/assets/img/boss2.png">
					</div>
					<div>
						<div>
							<span class="name">赵丹宇</span>
							<span>寒舍旅游投资管理集团有限公司联合创始人</span>
						</div>
						<div class="honor">
							<div>寒舍旅游投资管理集团有限公司联合创始人赵丹宇女士接受央视CCTV4英文栏目访谈（图中右一）</div>
						</div>
					</div>
				</div>
				<div class="title" id="honor">集团荣誉</div>
				<li>2014年干峪沟村因山里寒舍的建设获得农业部中国最美休闲乡村称号</li>
				<li>2016年寒舍度假酒店获得中国饭店业十佳客栈民宿品牌称号</li>
				<li>山里寒舍连续两年获得中国饭店协会颁发的2016、2017最受欢迎客栈民宿称号</li>
				<li>水岸寒舍连续两年获得中国饭店协会颁发的2016、2017最受欢迎客栈民宿称号</li>
				<li>2016年寒舍度假酒店被中国饭店协会被评为国际十佳度假酒店，国际十佳客栈民宿品牌</li>
				<li>寒舍度假酒店获2016亚洲旅游年度风尚大典“亚洲最佳度假酒店”奖</li>
				<li>水岸寒舍震泽丝寓荣获HOTEL探索之旅2017年最佳精品民宿大奖</li>
				<div class="honorImg">
					<img alt="寒舍" src="../assets/img/honor1.png">
					<img alt="寒舍" src="../assets/img/honor2.png">
				</div>
				<div class="title" id="chat">联系我们</div>
				<p>地址：北京经济技术开发区宏达中路12号</p>
				<p>邮编：100176</p>
				<p>电话：010-81002222</p>
				<p>地图：</p>
				<img alt="寒舍" src="@/assets/img/map.png" class="singleImg">
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
					title: '关于寒舍',
					eng: 'about'
				}, {
					title: '创始人说',
					eng: 'say'
				}, {
					title: '集团荣誉',
					eng: 'honor'
				}, {
					title: '联系我们',
					eng: 'chat'
				}],
				activeLink: 0
			};
		},
		async mounted() {
			let {
				data
			} = await this.$axios.post('/api/getBanner?sequence=9')
			this.banner = this.imgUrl + data.data.picture
			
			this.$axios.get('api/about/getAbout')
		},
		methods: {
			router(type){
				this.$router.push({
				    path: '/news',
				    query: {
				        type
				    }
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	@import "../assets/less/common";
	
	.news{
		.item{
			border-left: 3px solid #ececec;
			border-bottom: 1px solid #f2f2f2;
			border-right: 1px solid #f2f2f2;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 50px;
			cursor: pointer;
			&:hover{
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

			p,
			li,
			span,
			.honor>div {
				line-height: 80px !important;
			}

			.title {
				margin-bottom: 30px;
			}

			.imgContent {
				display: flex;

				.imgBox {
					width: 50%;
					margin-right: 50px;

					img {
						width: 100% !important;
						height: 100%;
						margin: 0 !important
					}
				}

			}
		}
	}

	.honorImg {
		width: 100%;

		img {
			width: 100%;
			margin-top: 20px;
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

			.anchor {
				overflow: hidden !important;

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
				margin: 20px 0 8px;
			}

			p {
				font-size: 16px;
				font-weight: 500;
				line-height: 30px;
				padding: 0;
				margin: 0;
			}

			li {
				font-size: 16px;
				font-weight: 500;
				line-height: 30px;
				padding: 0;
				margin: 0;
			}

			.small {}

			.imgContent {
				margin-top: 20px;
				display: flex;

				img {
					width: 387px;
					object-fit: cover;
					margin-right: 28px;
				}

				&>div {
					display: flex;
					flex-direction: column;
					color: @color;
					font-size: 16px;
					line-height: 30px;

					.name {
						font-size: 16px;
						margin-right: 10px;
					}

					.honor {
						margin-top: 10px;
					}
				}
			}

			.singleImg {
				width: 100%;
				margin-top: 23px;
			}
		}
	}

	.ant-anchor-ink {
		display: none !important;
	}
</style>
