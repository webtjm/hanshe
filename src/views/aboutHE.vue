<template>
<div>
    <!-- <img alt="寒舍" class="top" id="about" src="http://47.92.64.11:8877//uploadFile/2020/1/16/(1579167988978)海恩俱乐部轮播.png"> -->
    <div class="wrapper">
        <div class="left">
            <a-anchor wrapperClass="anchor">
                <a-anchor-link :href="'#'+item.eng" :title="item.title" v-for="(item,idx) of list" :key="idx" />
            </a-anchor>
        </div>
        <div class="right">
            <div class="title" id="about">关于海恩</div>
            <div class="middle">海恩俱乐部成立于2010年，是北京海恩商务俱乐部有限公司目前大力打造的高端国际旅游度假品牌。自成立以来以绿色原生态，永续度假为理念，积极倡导全新度假方式，引领时尚环保亲近自然的新潮流，专注高端度假，做服务国人的国际品牌。作为中国新兴权益度假领导者，海恩集团先后投资了山里逸居、山里寒舍、水岸寒舍、山里乐活、鸟取鹿野寒舍、北海道小樽寒舍等精品度假产品。</div>
            <div class="title" id="say">专享服务</div>
            <div class="imgContent">
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/zykf.png">
                </div>
                <div>专业客服，帮您优先订房，低价预订机票，地接等等全方位服务。</div>
            </div>
            <div class="imgContent">
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/gjfw.png">
                </div>
                <div>管家式服务，尽全力满足您的需求。力求尽善尽美。</div>
            </div>
            <div class="title" id="honor">会员权益</div>
            <div class="imgContent column">
                <p style="width:100%;text-align:center;">海恩会员的权益 Membership</p>
                <div class="imgBox">
                    <img alt="寒舍" class="hyqy" src="@/assets/img/hyqy.jpg">
                </div>
                <p>*山里会员中心保证会员每年享有 7夜套院的住宿权益（周日至周四即平日5晚，周五至周六即周末2晚）</p>
            </div>
            <div class="title" id="chat">联系海恩</div>
            <p class="middle" style="margin-bottom:0px;">联系人：刘亭亭</p>
            <p class="middle" style="margin-top:0px;">电话：010-67872652</p>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            list: [{
                title: '关于海恩',
                eng: 'about'
            }, {
                title: '专享服务',
                eng: 'say'
            }, {
                title: '会员权益',
                eng: 'honor'
            }, {
                title: '联系海恩',
                eng: 'chat'
            }],
        }
    }
}
</script>

<style lang="less" scoped>
@import "../assets/less/common";
.top {
    width: 100%;
    object-fit: cover;
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

            &.column {
                flex-flow: column;

                p {
                    font-size: 18px;
                }

                img {
                    margin: 28px 0 !important;
                }
            }

            img {
                width: 300px;
                object-fit: cover;
                margin-right: 28px;

                &.hyqy {
                    width: 100%;
                }
            }

            &>div {
                display: flex;
                flex-direction: column;
                color: @color;
                font-size: 18px;
                line-height: 30px;
                justify-content: center;

                &.innerleft {
                    margin-right: 28px;
                }

                &.innerright {
                    margin-left: 28px;
                }
            }
        }

        .singleImg {
            width: 100%;
            margin-top: 23px;
        }
    }

    .ant-anchor-ink {
        display: none !important;
    }
}
</style>
