<template>
<div>
    <!-- <img alt="寒舍" class="top" id="about" src="http://47.92.64.11:8877//uploadFile/2020/1/16/(1579167935740)农场轮播.jpg"> -->
    <div class="wrapper">
        <div class="left">
            <a-anchor wrapperClass="anchor">
                <a-anchor-link :href="'#'+item.eng" :title="item.title" v-for="(item,idx) of list" :key="idx" />
            </a-anchor>
        </div>
        <div class="right">
            <div class="title" id="about">寒舍家庭农场简介</div>
            <div class="imgContent column">
                <p class="middle">家庭农场位于风景秀美的北京市密云区，青山环抱，整个置身于茂盛的天然氧吧之中，农场均是根据地势散落分布在大自然之中。</p>
                <div class="imgBox">
                    <img alt="寒舍" class="hyqy" src="@/assets/img/familyFarm/5.jpg">
                </div>
                <p>这里远离闹市且充满生机，有天上飞的乌鸦、地上养的兔子。还有石头路、瓦石房、小炕床；早起会听见公鸡打鸣，邻居家的狗叫声，还能看见远处升起的袅袅炊烟，不一会传来葱油饼的味道，处处充满了生活的气息。</p>
                <div class="imgBox">
                    <img alt="寒舍" class="hyqy" src="@/assets/img/familyFarm/8.jpg">
                </div>
                <p>闲暇之余带上家人朋友去采摘蔬菜、采收禽蛋、或者BBQ、与小动物互动，真正的远离城市喧嚣，回归自然。</p>
                <div class="imgBox">
                    <img alt="寒舍" class="hyqy" src="@/assets/img/familyFarm/2.png">
                </div>
            </div>
            <div class="title" id="say">家庭农场提供一站式贴心服务</div>
            <div class="imgContent">
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/familyFarm/10.png">
                </div>
                <div>
                    <p class="middle">寒舍管家</p>
                    <p>山里寒舍为您配备专属管家，负责客人在寒舍农场期间的衣食住行，解决每位客人的后顾之忧。</p>
                </div>
            </div>
            <div class="imgContent">
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/familyFarm/11.png">
                </div>
                <div>
                    <p class="middle">农场管理员</p>
                    <p>每个农场配备专职管理员，聘请当地专业人员负责农场的日常打理，并为您的种植养殖提供必要的协助。</p>
                </div>
            </div>
            <div class="imgContent">
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/familyFarm/12.png">
                </div>
                <div>
                    <p class="middle">蔬果到家</p>
                    <p>根据时节，提供蔬果快递到家服务，让您身在城市，也能吃到绿色的蔬果、禽蛋，为您的健康保驾护航。</p>
                </div>
            </div>
            <div class="title" id="honor">家庭农场租赁价格：</div>
            <div class="imgContent column">
                <div class="imgBox">
                    <img alt="寒舍" class="hyqy" src="@/assets/img/familyFarm/13.png">
                </div>
                <p>权益：成为寒舍家庭农场主人后，寒舍集团将会赠送每年20间夜的居住权益，届时将可以在寒舍集团旗下国内外所有酒店进行消费。</p>
            </div>
            <div class="title" id="chat">寒舍集团旗下酒店：</div>
            <div class="imgContent chat">
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/familyFarm/14.png">
                    <p style="text-align:center">山里寒舍</p>
                </div>
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/familyFarm/15.png">
                    <p style="text-align:center">日本寒舍</p>
                </div>
                <div class="imgBox">
                    <img alt="寒舍" src="@/assets/img/familyFarm/16.png">
                    <p style="text-align:center">海岛寒舍</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            list: [{
                title: '农场简介',
                eng: 'about'
            }, {
                title: '专享服务',
                eng: 'say'
            }, {
                title: '租凭价格',
                eng: 'honor'
            }, {
                title: '旗下酒店',
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

            &#say {
                margin-bottom: 40px;
            }
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

            &.chat {
                justify-content: space-between;
                margin-top: 40px;

                .imgBox {
                    width: 30%;

                    img {
                        width: 100% !important;
                        margin: 0!important;
                    }

                    p {
                        text-align: center;
                        margin-top: 20px;
                    }
                }
            }

            &.column {
                flex-flow: column;

                p {
                    font-size: 18px;
                }

                img {
                    margin: 20px 0 !important;
                    height: auto !important;
                }
            }

            img {
                width: 300px;
                height: 180px;
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
