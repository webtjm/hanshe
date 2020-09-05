<template>
<div class="wrapper">
    <div class="cardWrapper">
        <div class="left">
            <div style="border-bottom:0">
                <div class="head">
                    <img alt="寒舍" :src="head">
                    <!-- 上传图片 -->
                    <input type="file" class="none" name="file" @change="changeHead($event)">
                    <span>{{level}}</span>
                </div>
                <div class="name">{{name}}</div>
                <div class="password" @click="showPassword=true">
                    <span>修改密码</span>
                    <i class="iconfont">&#xe664;</i>
                </div>
            </div>
            <div>
                <div v-for="(menu,idx) in menuList" :key="idx" class="menu">
                    <div :class="['menuItem', menu.routerName === $route.meta.name?'active':'']" @click.self="navitage(menu.href)">
                        {{menu.name}}
                        <div class="img-box" @click.stop="showSecChange">
                            <img alt="寒舍" src="@/assets/img/icon-xiala.png" v-if="(menu.routerName === $route.meta.name) && menu.childs">
                        </div>
                    </div>
                    <div v-if="(showSec && vxShowSec) && (menu.routerName === $route.meta.name)">
                        <div :class="['child-router', $route.fullPath===child.href?'exact-active':'']" v-for="child in menu.childs" :key="child.href" @click.stop="navitage(child.href)">{{child.name}}</div>
                    </div>
                </div>
            </div>
        </div>
        <ChangePassword v-if="showPassword" @close="closePassword" />
        <router-view />
    </div>
</div>
</template>

<script>
import ChangePassword from "@/components/personal/ChangePassword";
import PersonalInfor from "@/components/personal/PersonalInfor";
import PointManagement from "@/components/personal/PointManagement";
import HotelOrder from "@/components/personal/HotelOrder";
import PackageOrder from "@/components/personal/PackageOrder";
import EventReservation from "@/components/personal/EventReservation";
import CardDetail from "@/components/personal/CardDetail";
import Address from "@/views/shop/Address";
import Order from "@/views/shop/Order";
import {
    mapState,
    mapMutations
} from "vuex";

function formatDate(date) {
    let dd = new Date(date);
    return (
        dd.getFullYear() + "年" + (dd.getMonth() + 1) + "月" + dd.getDate() + "日"
    );
}
export default {
    data() {
        return {
            menuList: [{
                    name: "个人信息",
                    routerName: 'personalInfor',
                    href: '/personal/personalInfor'
                },
                {
                    name: "积分管理",
                    routerName: 'pointManagement',
                    href: '/personal/pointManagement'
                },
                {
                    name: "我的订单",
                    routerName: 'myorder',
                    href: '/personal/myorder',
                    childs: [{
                            name: "酒店订单",
                            href: '/personal/myorder/hotelOrder'
                        },
                        {
                            name: "套餐订单",
                            href: '/personal/myorder/packageOrder'
                        },
                        {
                            name: "商城订单",
                            href: '/personal/myorder/shopOrder'
                        }
                    ]
                },
                {
                    name: "活动预订",
                    routerName: 'eventReservation',
                    href: '/personal/eventReservation'
                },
                {
                    name: "我的账单",
                    routerName: 'myBill',
                    href: '/personal/myBill'
                },
                {
                    name: "我的卡券",
                    routerName: 'myCard',
                    href: '/personal/myCard',
                    childs: [{
                        name: "乐享卡",
                        href: '/personal/myCard/cardDetail'
                    }]
                },
                {
                    name: "意见反馈",
                    routerName: 'feedback',
                    href: '/personal/feedback',
                    childs: [{
                            name: "我的反馈",
                            href: '/personal/feedback/myFeedback'
                        },
                        {
                            name: "新增反馈",
                            href: '/personal/feedback/addFeedback'
                        }
                    ]
                },
                {
                    name: "地址管理",
                    routerName: 'addressManage',
                    href: '/personal/addressManage',
                    childs: [{
                            name: "我的地址",
                            href: '/personal/addressManage/myAddress'
                        },
                        {
                            name: "新增地址",
                            href: '/personal/addressManage/addAddress'
                        }
                    ]
                }
            ],
            name: "游客",
            level: "",
            showPassword: false,
            loading: false,
            showSec: false,
            head: "",
            user: {},
            // 上传的
            feedPhoto: [],
            // 显示的img
            feedImg: [],
            feedDetail: "",
            bills: [],
            card: [],
            validity: "20190630-20191201",
            singleCard: {
                buyTime: 1564451106000,
                canUseNumber: 0,
                useNumber: 0,
                validity: 0,
                use: [{
                    id: 1,
                    purchaseId: 1,
                    cityName: "北海道",
                    hotelName: "小樽寒舍",
                    createTime: 1564451106000,
                    time: ""
                }]
            }
        };
    },
    computed: {
        ...mapState('main', [
            'personalIdx',
            'secIdx',
            'vxShowSec'
        ]),
        menuIdx() {
            return this.personalIdx
        }
    },
    async mounted() {
        this.showSec = this.vxShowSec
        let token = localStorage.getItem("hsToken");
        if (token) {
            this.$axios
                .get("/api/userInfo")
                .then(async ({
                    data
                }) => {
                    if (data.errcode === 0 && data.user) {
                        this.user = data.user;
                        localStorage.setItem('userInfo', this.$qs.stringify(data.user))
                        this.level = data.userLevel + "会员";
                        this.name = data.user.username;
                        if (data.user.photo) {
                            if (data.user.photo.indexOf('http') === -1) {
                                this.head = this.imgUrl + data.user.photo
                            } else {
                                this.head = data.user.photo
                            }
                        }
                        this.setUserInfor(data.user);
                        // this.getFeedback();
                        // this.getBills();
                    }
                })
                .catch(err => {
                    this.$message.info("网络出错了~~~");
                });
        } else {
            this.setShowLogin(true);
            this.$message.info("您还未登录");
            this.$router.push("/");
        }
    },
    methods: {
        ...mapMutations('main', [
            'setUserInfor',
            'setShowLogin',
            'setSecIdx',
            'setPersonalIdx',
            'setVxShowSec'
        ]),
        showSecChange() {
            this.showSec = this.showSec ? false : true
            this.setVxShowSec(this.setVxShowSec)
        },
        changeChildIdx(idx) {
            if (this.menuList[idx].childs) {
                this.setSecIdx(0);
                this.showSec === true ? (this.showSec = false) : (this.showSec = true);
            } else {
                this.showSec = false;
            }
            this.setPersonalIdx(idx);
        },

        navitage(url) {
            this.showSec = true
            this.$router.push(url);
        },
        async getData(url, params, key = "data") {
            let {
                data
            } = await this.$axios.get(url, {
                params: params
            });
            if (data.errcode === 0) {
                return data[key];
            }
        },
        // 修改头像
        async changeHead(e) {
            let self = this;
            const files = e.target.files[0];
            if (!e || !window.FileReader) return; // 看支持不支持FileReader
            let reader = new FileReader();
            reader.readAsDataURL(files); // 这里是最关键的一步，转换就在这里
            reader.onloadend = function () {
                self.head = this.result;
            };
            let photo = await this.uploadFile(files);
            if (photo) {
                let {
                    data
                } = await this.$axios.get("/api/updatePhoto", {
                    params: {
                        photo
                    }
                });
                this.$axios.get("/api/userInfo").then(async ({
                    data
                }) => {
                    if (data.errcode === 0 && data.user) {
                        this.setUserInfor(data.user);
                    }
                });
            } else {
                this.$message.info("上传文件失败");
            }
        },
        // 上传文件
        async uploadFile(files) {
            let self = this;
            let data = new FormData();
            data.append("file", files, files.name);
            let res = await this.$axios.post("/file/upload", data, {
                headers: {
                    "content-type": "multipart/form-data"
                }
            });
            if (res.data.errcode === 0) {
                return res.data.data;
            } else {
                return "";
            }
        },
        closePassword() {
            this.showPassword = false;
        }
    },
    components: {
        ChangePassword,
        PersonalInfor,
        PointManagement,
        HotelOrder,
        PackageOrder,
        EventReservation,
        CardDetail,
        Address,
        Order
    }
};
</script>

<style lang="less" scoped>
@import "../assets/less/common.less";
@import "../assets/less/iconfont.less";

.container {
    flex: 1;
    margin-left: 43px;
    border: 1px solid rgba(69, 75, 108, 0.15);
    font-size: 16px;
    color: #484848;
    padding: 24px 33px;
    min-width: 400px;
}

.wrapper {
    border-top: 2px solid @color;

    .cardWrapper {
        width: 70%;
        margin: 25px auto;
        display: flex;
        justify-content: space-between;

        .left {
            width: 180px;

            &>div {
                border: 1px solid rgba(69, 75, 108, 0.15);
                display: inline-block;
                width: 100%;
                text-align: center;

                .head {
                    width: 85px;
                    height: 85px;
                    border-radius: 85px;
                    border: 1px solid rgba(69, 75, 108, 0.15);
                    margin: 0 auto;
                    margin-top: 20px;
                    position: relative;

                    img {
                        width: 75px;
                        height: 75px;
                        border-radius: 75px;
                        margin-top: 5px;
                    }

                    .none {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 75px;
                        height: 75px;
                        opacity: 0;
                    }

                    span {
                        position: absolute;
                        color: #fff;
                        background-color: #ff7044;
                        top: -10px;
                        right: -46px;
                        border-radius: 20px;
                        font-size: 14px;
                        padding: 4px 10px;
                        transform: scale(0.7);
                    }
                }

                .name {
                    font-size: 18px;
                    font-weight: bold;
                    color: @color;
                    margin-top: 12px;
                }

                .password {
                    font-size: 14px;
                    transform: scale(0.85);
                    text-align: right;
                    margin: 20px 0px 10px 0;
                    color: @color;

                    span {
                        text-decoration: underline;
                        cursor: pointer;
                    }

                    i {
                        text-decoration: none;
                        cursor: pointer;
                    }
                }

                .menu {
                    font-size: 16px;
                    cursor: pointer;

                    .menuItem {
                        padding-right: 8px;
                        border-left: 8px solid #fff;
                        height: 46px;
                        line-height: 46px;
                        color: #cacaca;
                        position: relative;
                        cursor: pointer;

                        .img-box {
                            position: absolute;
                            right: 14px;
                            top: 50%;
                            margin-top: -15px;
                            height: 30px;
                            width: 30px;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;

                            img {
                                width: 10px;
                            }
                        }
                    }

                    .active {
                        border-left: 8px solid @color;
                        box-sizing: border-box;
                        font-weight: bold;
                        color: @color;
                        background-color: #ebedf2;
                        cursor: pointer;
                    }

                    .child-router {
                        background-color: #f6f7f9;
                        color: #cacaca;
                        height: 46px;
                        line-height: 46px;
                    }

                    .exact-active {
                        font-weight: bold;
                        color: @color;
                    }
                }

            }
        }

        .box {
            flex: 1;
            margin-left: 43px;
            padding: 22px 32px;
            border: 1px solid rgba(69, 75, 108, 0.15);

            .ant-table-thead {
                tr {
                    th {
                        background-color: #ebedf2;
                        color: @color;
                        padding: 9px;
                        text-align: center;
                    }
                }
            }

            .ant-table-body {
                tr {
                    td {
                        text-align: center;

                        .feedImg {
                            width: 80px;
                            height: 80px;
                            margin-right: 8px;
                            object-fit: cover;
                        }
                    }
                }
            }

            .count {
                font-size: 16px;
                color: #ff7044;
            }
        }

        .card-wrapper {
            display: flex;
            flex-wrap: wrap;
            width: 1000px;
            margin-left: 43px;
            padding: 22px;
            border: 1px solid rgba(69, 75, 108, 0.15);
            // .card {
            //   width: 455px;
            //   height: 142px;
            //   border-radius: 4px;
            //   overflow: hidden;
            //   margin: 0px 15px 10px 0;
            //   position: relative;
            //   img {
            //     width: 100%;
            //     height: 100%;
            //     position: absolute;
            //     top: 0;
            //     left: 0;
            //     z-index: -1;
            //   }
            //   .name {
            //     font-size: 23px;
            //     color: #fff;
            //     font-weight: bolder;
            //     margin: 26px 18px;
            //   }
            //   .detail {
            //     display: flex;
            //     align-items: center;
            //     font-size: 12px;
            //     color: #fff;
            //     margin: 0 18px;
            //     span{
            //       flex: 1;
            //     }
            //     button {
            //       background-color: rgba(0, 0, 0, 0.5);
            //       padding: 4px 8px;
            //       font-size: 12px;
            //       color: #fff;
            //       border-radius: 16px;
            //       border: 1px solid #cacaca;
            //       transform: scale(0.8);
            //     }
            //   }
            // }
        }

        .singleCard {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            width: 460px;
            color: @color;
            text-align: center;
            font-size: 16px;

            i {
                position: absolute;
                top: -25px;
                right: -25px;
                font-size: 25px;
                color: #fff;
            }

            img {
                width: 100%;
            }

            .cardTitle {
                margin: 12px auto;
                border: 1px solid @color;
                padding: 6px 10px;
                border-radius: 10px;
                display: inline-block;
                text-align: center;
            }

            .cardContent {
                padding-bottom: 20px;

                &>div {
                    display: flex;
                    justify-content: space-around;
                    text-align: center;

                    span {
                        line-height: 26px;
                    }
                }
            }
        }

        .feedbackWrapper {
            flex: 1;
            margin-left: 43px;

            .feedback {
                padding: 22px;
                border: 1px solid rgba(69, 75, 108, 0.15);
                width: 100%;

                .title {
                    border-bottom: 2px dashed #cacaca;
                    padding-bottom: 12px;
                    color: #8d8d8d;
                    font-size: 16px;

                    .add {
                        color: @color;
                        text-decoration: underline;
                        margin-left: 38px;
                        font-weight: bold;
                    }
                }

                .imgWrapper {
                    margin-top: 22px;

                    img {
                        width: 80px;
                        height: 80px;
                        margin-right: 8px;
                        object-fit: cover;
                    }

                    .addWrapper {
                        display: inline-block;
                        position: relative;

                        input {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 80px;
                            height: 80px;
                            opacity: 0;
                        }
                    }
                }

                textarea {
                    font-size: 14px;
                    margin-top: 22px;
                    border: 0;
                    outline: 0;
                }
            }

            button {
                padding: 12px 38px;
                border-radius: 8px;
                border: 0;
                color: #fff;
                font-size: 16px;
                margin: 38px auto;
                background-color: @color;
                display: block;
            }
        }
    }
}
</style>
