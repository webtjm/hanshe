<template>
<div class="header">
    <div class="logoWrapper" @click="linkTo('/')">
        <img alt="寒舍" src="@/assets/img/hanshe1.png">
        <!-- <span>HANSHE</span> -->
    </div>
    <div class="menuWrapper">
        <div v-for="item in menuList" :key="item.english" @click="linkTo(item.link)" class="item">
            <div :class="item.childs?'menu hover':'menu'">
                <div class="menuName">{{item.chinese}}</div>
                <span class="menuEng">{{item.english}}</span>
                <div class="more" v-if="item.childs">
                    <div v-for="child in item.childs" :key="child.english" @click.stop="linkTo(child.link)">
                        <div>{{child.chinese}}</div>
                        <div style="font-family: hansans;font-weight: bold;">{{child.english}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 未登录的状态 -->
        <div @click="toLogin" v-if="!loginState">
            <div class="menu">
                <div class="menuName">登录</div>
                <span class="menuEng">Sign up</span>
            </div>
        </div>
        <!-- 已登录的状态 -->
        <div class="personal" v-else>
            <div class="headWrapper">
                <div class="head-wrap"><img alt="寒舍" :src="head"></div>
                <span></span>
            </div>
            <div class="list">
                <div v-for="(menu,idx) in personMenu" :key="idx" style="position: relative;cursor:pointer;">
                    <span class="list-item" @click.stop="toPersonal(menu.href)">{{menu.name}}</span>
                </div>
                <div @click="exit">退出登录</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapMutations
} from 'vuex';
export default {
    data() {
        return {
            menuList: [{
                    chinese: "预订",
                    english: "Reservations",
                    link: "/reservations"
                },
                {
                    chinese: "目的地",
                    english: "Destination",
                    link: "/destination"
                },
                {
                    chinese: "乐享优惠",
                    english: "Promotion",
                    link: "/promotion",
                    childs: [{
                            chinese: "优惠套餐",
                            english: "Package",
                            link: "/discountPackage"
                        },
                        {
                            chinese: "活动举办",
                            english: "Event",
                            link: "/event"
                        },
                        {
                            chinese: "餐厅美食",
                            english: "Food",
                            link: "/food"
                        },
                        {
                            chinese: "休闲娱乐",
                            english: "Entertainment",
                            link: "/entertainment"
                        },
                        {
                            chinese: "更多优惠",
                            english: "MoreOffers",
                            link: "/activity"
                        }
                    ]
                },
                {
                    chinese: "关于我们",
                    english: "About HANSHE",
                    link: "/about"
                },
                {
                    chinese: "商店",
                    english: "Shop",
                    link: "/shop"
                }
            ],
            personMenu: [{
                    name: "个人信息",
                    href: '/personal/personalInfor'
                },
                {
                    name: "积分管理",
                    href: '/personal/pointManagement'
                },
                {
                    name: "我的订单",
                    href: '/personal/myorder'
                },
                {
                    name: "活动预订",
                    href: '/personal/eventReservation'
                },
                {
                    name: "我的账单",
                    href: '/personal/myBill'
                },
                {
                    name: "我的卡券",
                    href: '/personal/myCard'
                },
                {
                    name: "我的购物车",
                    href: '/cart'
                },
                {
                    name: "意见反馈",
                    href: '/personal/feedback'
                }
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
        ]),
        ...mapState('shopcart', [
            'shopcart'
        ]),
        goodNum(){
            var num = 0
            this.shopcart.forEach(item => {
                num = num+item.num
            });
            return num
        },
        head() {
            if(this.user && this.user.photo) {
                if(this.user.photo.indexOf('http') === -1) {
                    return this.imgUrl + this.user.photo
                } else {
                    return this.user.photo
                }
            }
        }
    },
    methods: {
        ...mapMutations('main', [
            'setShowLogin',
            'setPersonalIdx',
            'setLoginState',
            'setUserInfor',
            'setVxShowSec'
        ]),
        toLogin() {
            this.setShowLogin(true);
        },
        linkTo(link) {
            this.$router.push(link);
        },
        toPersonal(url) {
            this.$router.push(url);
            this.setVxShowSec(true)
        },
        exit() {
            console.log('exit')
            localStorage.removeItem("hsToken");
            this.setLoginState(false)
            this.setUserInfor({})
            this.$router.push('/')
        },
        toShopcart(){
          this.$router.push('/cart')
        }
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";
@import "../../assets/font/myFont.css";
@import "../../assets/font/font1.css";
@media screen and (max-width: 1000px) {
    .menuEng{
        display: none!important;
    }
}
.header {
    width: 100%;
    background-color: #fff;
    padding: 0px 2%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    // flex-wrap: wrap;
    align-content: center;
    border-top: 14px solid @color;
    font-family: gongyeMin;

    .logoWrapper {
        display: flex;
        align-items: center;
        padding: 30px 0;
        cursor: pointer;

        & img {
            // width: 58px;
            height: 80px;
            position: relative;
            top: -4px;
        }

        // & span {
        //     padding: 0 20px;
        //     font-size: 50px;
        //     color: @color;
        //     font-family: hanzhen;
        //     width: 400px;
        // }
    }

    .menuWrapper {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        position: relative;

        .menu {
            position: relative;
            display: inline-block;
            text-align: center;
            font-size: 18px;
            color: @color;
            padding: 34px 30px;
            // width: 150px;
            cursor: pointer;

            .menuName {
                padding-top: 10px;
                margin-bottom: 2px;
            }

            .menuEng {
                font-family: hansans;
                font-weight: bold;
            }

            .more {
                display: none;
                position: absolute;
                left: 0;
                margin-top: 10px;
                z-index: 10;
                background-color: #fff;

                &>div {
                    font-size: 14px;
                    color: #8d8d8d;
                    text-align: center;
                    // width: 150px;
                    padding: 12px 30px;
                }

                &>div:hover {
                    background-color: #cacaca;
                }
            }
        }

        .menu:hover {
            // box-shadow: 0 -5px 7px 1px rgba(17, 22, 50, 0.22);
            // color: #9d8dbd;
            color: #8d8d8d;

            .more {
                display: block;
            }
        }

        .personal {
            position: relative;

            .headWrapper {
                position: relative;
                padding: 30px 25px;

                .head-wrap {
                    width: 58px;
                    height: 58px;
                    border-radius: 58px;
                    background-color: #ccc;
                }

                img {
                    width: 58px;
                    height: 58px;
                    border-radius: 58px;
                }

                span {
                    position: absolute;
                    bottom: 24px;
                    right: 20px;
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border-width: 8px 0 8px 8px;
                    border-style: solid;
                    border-color: transparent transparent transparent #8d8d8d;
                    transform: rotate(45deg);
                    border-radius: 10px;
                }
            }

            .list {
                display: none;
                position: absolute;
                top: 100px;
                left: -20px;
                box-shadow: 0px 0px 6px 0px rgba(17, 22, 50, 0.22);
                background-color: #fff;
                border-radius: 4px;
                overflow: hidden;
                z-index: 100;

                .shopcart-num {
                    width: 20px;
                    height: 20px;
                    position: absolute;
                    top: -2px;
                    right: 5px;
                    background: red;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                &>div {
                    width: 112px;
                    padding: 10px 0;
                    color: #8d8d8d;
                    font-size: 14px;
                    text-align: center;
                    cursor: default;
                }

                &>div:hover {
                    background-color: #cacaca;
                }
            }
        }

        .personal:hover {
            .list {
                display: block;
            }
        }
    }
}
</style>
