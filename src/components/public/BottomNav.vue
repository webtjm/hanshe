<template>
<footer>
    <div class="footer-box">
        <div class="left">
            <div class="logoWrapper">
                <img alt="寒舍" src="@/assets/img/hanshe2.png">
                <!-- <span>HANSHE</span> -->
            </div>
            <div class="contact">
                <div class="bTitle">联系我们</div>
                <ul>
                    <li>
                        地址：北京市亦庄宏达中路12号 寒舍旅游投资管理集团有限公司
                    </li>
                    <li>
                        邮编：100176
                    </li>
                    <li>
                        电话：010-8100 2222 、400 870 3070
                    </li>
                </ul>
                <div class="font">
                    <i class="iconfont">&#xe668;</i>
                    <i class="iconfont">&#xe64f;</i>
                    <i class="iconfont">&#xe7d8;</i>
                    <i class="iconfont">&#xe619;</i>
                    <i class="iconfont">&#xe605;</i>
                    <i class="iconfont">&#xe6eb;</i>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="menuWrapper">
                <div v-for="item in menuList" :key="item.english" @click="handleClick(item.link)">
                    <div class="menu">
                        <div class="menuName">{{item.chinese}}</div>
                        <span class="menuEng">{{item.english}}</span>
                    </div>
                </div>
                <div>
                    <div class="menu" v-if="loginState">
                        <div class="menuName">已登录</div>
                        <div class="menuEng">Sign up</div>
                    </div>
                    <div class="menu" v-else>
                        <div class="menuName">登录</div>
                        <div class="menuEng">Sign up</div>
                    </div>
                </div>
            </div>
            <div class="honor">
                <div class="bTitle">酒店荣誉</div>
                <ul>
                    <li v-for="item in honor" :key="item">
                        <i class="iconfont">&#xe674;</i>
                        {{item}}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="beian">
        <div class="copyright">
            © Copyright 2019. All rights reserved 版权所有. 寒舍旅游投资管理集团有限公司
        </div>
        <div class="num">
            <img alt="寒舍" src="@/assets/img/gongan.png">
            <a class="text" href="http://www.beian.miit.gov.cn/" target="_blank">京ICP备 19054455号</a>
        </div>
    </div>
</footer>
</template>

<script>
import {
    mapMutations,
    mapState
} from 'vuex';
export default {
    data() {
        return {
            menuList: [{
                chinese: "预订",
                english: "Reservations",
                link: "/reservations"
            }, {
                chinese: "目的地",
                english: "Destination",
                link: "/destination"
            }, {
                chinese: "乐享优惠",
                english: "Promotion",
                link: "/promotion"
            }, {
                chinese: "关于我们",
                english: "About HANSHE",
                link: "/about"
            }, {
                chinese: "商店",
                english: "Shop",
                link: "/shop"
            }],
            honor: [
                "2014年干峪沟村因山里寒舍的建设获得农业部中国最美休闲乡村称号",
                "2016年寒舍度假酒店获得中国饭店业十佳客栈民宿品牌称号",
                "山里寒舍连续两年获得中国饭店协会颁发的2016、2017最受欢迎客栈民宿称号",
                "水岸寒舍连续两年获得中国饭店协会颁发的2016、2017最受欢迎客栈民宿称号",
                "2016年寒舍度假酒店被中国饭店协会被评为国际十佳度假酒店，国际十佳客栈民宿品牌",
                "寒舍度假酒店获2016亚洲旅游年度风尚大典“亚洲最佳度假酒店”奖",
                "水岸寒舍震泽丝寓荣获HOTEL探索之旅2017年最佳精品民宿大奖"
            ]
        };
    },
    // computed: mapState({
    //   loginState: state => state.loginState,
    //   user: state => state.user
    // }),
    computed: {
        ...mapState('main', [
            'loginState',
            'user'
        ])
    },
    methods: {
        ...mapMutations('main', [
            'setShowLogin'
        ]),
        handleClick(link) {
            if (link !== '/') {
                this.$router.push(link);
            } else {
                this.setShowLogin(true)
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
@import "../../assets/font/myFont.css";

@media screen and (max-width: 1000px) {
    .menuEng {
        display: none !important;
    }
}

footer {
    background-color: @color;
    padding: 65px 50px 118px 80px;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    flex-flow: column;
    align-items: center;
    position: relative;

    .beian {
        margin-top: 20px;
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 65px;
        .copyright{
          margin-right: 50px;
        }

        .num {
            display: flex;
            align-items: center;

            img {
                margin-right: 10px;
            }

            a {
                color: #fff;
            }
        }
    }

    .footer-box {
        display: flex;
        justify-content: space-between;
    }

    .left {
        width: 45%;

        .logoWrapper {
            display: flex;
            align-items: center;
            margin-bottom: 130px;
            height: 58px;

            & img {
                // width: 58px;
                height: 80px;
                position: relative;
                top: -4px;
            }

            // & span {
            //   padding: 0 20px;
            //   font-size: 45px;
            //   font-family: hanzhenMin;
            // }
        }
    }

    .right {
        flex: 1;

        .menuWrapper {
            height: 60px;
            font-family: gongyeMin;
            margin-bottom: 130px;
            display: flex;
            justify-content: space-between;

            .menu {
                padding: 0 20px;
                display: inline-block;
                text-align: center;
                font-size: 18px;
                color: #fff;

                .menuName {
                    padding-top: 10px;
                    margin-bottom: 2px;
                }

                .menuEng {
                    font-family: hansansMin;
                }
            }
        }
    }

    .bTitle {
        font-family: hanzhenMin;
        padding-bottom: 26px;
        font-size: 20px;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    ul>li {
        margin-bottom: 5px;
        list-style: none;
        font-size: 16px;
    }

    .backTop {
        text-align: right;
        margin-top: 30px;
    }

    .iconfont {
        font-size: 20px;
        padding-right: 12px;
    }

    .font .iconfont {
        font-size: 22px;
    }

    .honor {
        margin-left: 20px;
    }
}
</style>
