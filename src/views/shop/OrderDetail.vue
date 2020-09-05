<template>
<div class="main-box">
    <div class="content-box">
        <a-breadcrumb>
            <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/">HANSHE HOTEL</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/personal/myorder/shopOrder">我的订单</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/shopOrderDetail">订单详情</router-link>
            </a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tip-container" v-if="orderDetail.status == 0">
            <div class="tip">
                <img alt="寒舍" style="width:18px;height:18px;" src="@/assets/img/icon-attention.png">
                您需要在30分钟内完成支付，否则该订单将会被取消！
                <span class="time">{{remaining}}</span>
            </div>
        </div>
        <div class="status-container border-box">
            <div class="header">
                <span>订单编号：{{orderDetail.id}}</span>
                <span>当前状态：
                    <span v-if="orderDetail.status == 0">待付款</span>
                    <span v-if="orderDetail.status == 1">待发货</span>
                    <span v-if="orderDetail.status == 2">待收货</span>
                    <span v-if="orderDetail.status == 3">交易成功</span>
                    <span v-if="orderDetail.status == -1">退款中</span>
                    <span v-if="orderDetail.status == -2||orderDetail.status == 4">交易关闭</span>
                </span>
            </div>
            <!-- 
                // 0待付款，1待发货，2待收货，3结束，-1退款中
             -->
            <div class="status">
                <div class="status-item">
                    <span :class="['name', 'name-active']">提交订单</span>
                    <div class="icon-box">
                        <div class="status-num">
                            <span :class="'active'">1</span>
                        </div>

                        <span class="contact-line-right"></span>
                    </div>
                    <div class="time">
                        <span v-if="orderDetail.orderTime">{{orderDetail.orderTime}}</span>
                    </div>
                </div>
                <div class="status-item">
                    <span :class="['name', orderDetail.status == 1||orderDetail.status == 2||orderDetail.status == 3||orderDetail.status == -1?'name-active':'']">买家付款</span>
                    <div class="icon-box">
                        <div class="status-num">
                            <span :class="[orderDetail.status == 1||orderDetail.status == 2||orderDetail.status == 3||orderDetail.status == -1?'active':'']">2</span>
                        </div>

                        <span class="contact-line-left"></span>
                        <span class="contact-line-right"></span>
                    </div>
                    <div class="time">
                        <span v-if="orderDetail.payTime">{{orderDetail.payTime}}</span>
                    </div>
                </div>
                <div class="status-item">
                    <span class="name" :class="orderDetail.status == -1||orderDetail.status == 2||orderDetail.status == 3?'name-active':''">卖家发货</span>
                    <div class="icon-box">
                        <div class="status-num">
                            <span :class="orderDetail.status == -1||orderDetail.status == 2||orderDetail.status == 3?'active':''">3</span>
                        </div>

                        <span class="contact-line-left"></span>
                        <span class="contact-line-right"></span>
                    </div>
                    <div class="time">
                        <span v-if="orderDetail.expressTime">{{orderDetail.expressTime}}</span>
                    </div>
                </div>
                <div class="status-item">
                    <span class="name" :class="orderDetail.status == 3?'name-active':''">确认收货</span>
                    <div class="icon-box">
                        <div class="status-num">
                            <span :class="orderDetail.status == 3?'active':''">4</span>
                        </div>
                        <span class="contact-line-left"></span>
                    </div>
                    <div class="time">
                        <span v-if="orderDetail.status == 3">{{orderDetail.orderTime}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="address-container border-box">
            <div class="title">收货信息</div>
            <div class="items">
                <div class="item">
                    <span>联系人</span>
                    <span>{{orderDetail.username}}</span>
                </div>
                <div class="item">
                    <span>手机号码</span>
                    <span>{{orderDetail.moblie}}</span>
                </div>
                <div class="item">
                    <span>地址</span>
                    <span>{{orderDetail._address}}</span>
                </div>
            </div>
        </div>
        <div class="remark-container border-box">
            <div class="title">备注信息</div>
            <div class="remark">{{orderDetail.remark}}</div>
        </div>
        <div class="goods-list-container border-box">
            <div class="title">送货清单</div>
            <ul class="cart-list">
                <li class="cart-head">
                    <span class="photo">图片</span>
                    <span class="name">商品名称</span>
                    <span class="param">商品规格</span>
                    <span class="price">单价</span>
                    <span class="num">数量</span>
                    <span class="total">小计</span>
                </li>
                <li class="cart-item" v-for="item in goodList" :key="item.id">
                    <span class="photo">
                        <img alt="寒舍" :src="imgUrl + item.picture[0]">
                    </span>
                    <span class="name">{{item.title}}</span>
                    <span class="param">
                        <div v-for="(spec, index) in item.spec" :key="index">{{spec}}</div>
                    </span>
                    <span class="price">¥ {{item.price}}</span>
                    <span class="num">{{item.num}}</span>
                    <span class="total">¥ {{item.price * item.num}}</span>
                </li>
            </ul>
        </div>
        <div class="detail-container border-box">
            <div class="title">订单明细</div>
            <div class="items">
                <div class="item">
                    <span>小计</span>
                    <span>￥{{(orderDetail.totalPrice - orderDetail.expressPrice).toFixed(2)}}</span>
                </div>
                <div class="item">
                    <span>运费</span>
                    <span>￥{{orderDetail.expressPrice}}</span>
                </div>
                <div class="item">
                    <span>支付方式</span>
                    <span>微信支付</span>
                </div>
            </div>
            <div class="total"><span>总计：</span><span>￥{{orderDetail.totalPrice}}</span></div>
            <div class="pay-box">
                <!-- 0待付款，1待发货，2待收货，3结束，-1退款中 -->
                <div class="pay-button" v-if="orderDetail.status == 1||orderDetail.status == 2" @click="toRefund('selectRefund')">申请退款</div>
                <div class="pay-button" v-if="orderDetail.status == -1||orderDetail.status == 4" @click="toRefund('refund')">查看退款进度</div>
                <div class="pay-button" v-if="orderDetail.status == 0" @click="toBuy(orderDetail.id)">支付</div>
                <div class="pay-button" v-if="orderDetail.status == 0" @click="cancelBuy(orderDetail.id)">取消</div>
                <div class="pay-button" v-if="orderDetail.status == 2" @click="confirmReceive(orderDetail.id)">确认收货</div>
                <div class="pay-button" @click="deleteOrder(orderDetail.id)" v-if="orderDetail.status==-2||orderDetail.status==3||orderDetail.status==4">删除订单</div>
            </div>
        </div>
        <div class="transport-container border-box" v-if="orderDetail.status == 2">
            <div class="title">物流信息</div>
            <div class="items">
                <div class="item" v-if="orderDetail.expressTime">
                    <span>发货时间</span>
                    <span>{{orderDetail.expressTime}}</span>
                </div>
                <div class="item" v-if="orderDetail.expressName">
                    <span>物流公司</span>
                    <span>{{orderDetail.expressName}}</span>
                </div>
                <div class="item" v-if="orderDetail.expressNum">
                    <span>快递单号</span>
                    <span>{{orderDetail.expressNum}}</span>
                </div>
                <div class="item">
                    <span>物流信息</span>
                    <div class="item-content" v-if="traces.length>0">
                        <p v-for="(item, index) in traces" :key="index">
                            {{item.AcceptTime}} {{item.AcceptStation}}
                        </p>
                    </div>
                    <div class="item-content" v-else>
                        <p>暂时没有物流信息</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import DateFormat from '@/config/formTime.js'
import {
    mapState,
    mapActions,
    mapMutations
} from 'vuex'
export default {
    data() {
        return {
            orderDetail: {},
            goodList: [],
            remainTime: 1800,
            lastTime: 0,
            id: '',
            traces: [],
            clockId: '',
        }
    },
    computed: {
        ...mapState('shopcart', [
            'shopcart'
        ]),
        remaining() {
            let minute = Math.floor(this.remainTime / 60)
            let second = this.remainTime % 60
            console.log(this.remainTime)
            if (this.remainTime < 0) {
                return '0分钟0秒'
            }
            return minute + '分钟' + second + '秒'
        },
    },
    methods: {
        ...mapActions('shopcart', [
            'commitShopcartData'
        ]),
        ...mapMutations('main', [
            'setPersonalIdx',
            'setSecIdx'
        ]),
        getOrderDetail(id) {
            this.$axios.post(`api/getShopOrderInfo?id=${id}`).then(res => {
                if (res.data.errcode === 0) {
                    // orderDetail
                    var obj = {}
                    for (var key in res.data.data) {
                        obj[key] = res.data.data[key]
                    }
                    obj._address = obj.province + obj.city + obj.region + obj.address
                    obj.orderTime = new DateFormat().setTime(obj.creTime).toString('yyyy-0m-0d 0h:0f:0s')
                    obj.payTime = obj.payTime ? new DateFormat().setTime(obj.payTime).toString('yyyy-0m-0d 0h:0f:0s') : null
                    obj.expressTime = obj.expressTime ? new DateFormat().setTime(obj.expressTime).toString('yyyy-0m-0d 0h:0f:0s') : null
                    this.orderDetail = obj

                    // goodList
                    var goodList = res.data.orderItem
                    goodList.forEach(item => {
                        item.spec = item.spec.split(',')
                        item.picture = item.picture.split(',')
                    })
                    this.goodList = goodList
                    if (obj.status == 0) {
                        this.toClock()
                    } else if (obj.status == 2) {
                        this.getExpressMsg(obj.id)
                    }
                    console.log(this.orderDetail)
                }
            })
        },
        toClock() {
            let initStart, start, end
            // 先清空定时器
            clearInterval(this.clockId)
            initStart = this.orderDetail.creTime,
                console.log(initStart)
            // initStart = 1563852709627,
            end = initStart + this.remainTime * 1000
            this.clockId = setInterval(() => {
                // console.log('sss')
                start = new Date().getTime()
                this.remainTime = Math.floor((end - start) / 1000)
                if (this.remainTime < 1) {
                    this.closeOrder(this.id)
                }
            }, 1000)
        },
        closeOrder(id) {
            clearInterval(this.clockId)
            this.lastTime = 0
            this.$axios.post('/api/cancelShopOrder?id=' + id).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.status = -1
                    this.$notify({
                        title: '提示',
                        message: '订单关闭！',
                        type: 'warning'
                    });
                }
            })
        },
        toBuy(id) {
            this.$router.push({
                name: 'orderPay',
                params: {
                    orderId: id
                }
            })
        },
        //取消订单
        cancelBuy(id) {
            // console.log(idx, id)
            this.$confirm('确定取消此订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.closeOrder(this.id)
            })
        },
        //获取快递信息
        getExpressMsg(id) {
            this.$axios.post(`api/getExpressMsg?id=${id}`)
                .then(res => {
                    if (res.data.errcode == 0) {
                        var info = JSON.parse(res.data.data)
                        this.traces = info.Traces
                    }
                })
        },
        //退款
        toRefund(name) {
            this.$router.push({
                path: `/orderRefund/${name}`,
                query: {
                    id: this.id
                }
            })
        },
        //删除订单
        deleteOrder(id) {
            this.$confirm('确定删除此订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post(`api/delShopOrder?id=${id}`).then(res => {
                    if (res.data.errcode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '订单删除成功',
                            type: 'success'
                        })
                        this.setPersonalIdx(7);
                        this.setSecIdx(1)
                        this.$router.push('/personal/myorder/shopOrder');
                    }
                })
            })
        },
        //确认收货
        confirmReceive(id) {
            this.$confirm('是否已收到您购买的商品？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post(`api/confirmOrder?id=${id}`).then(res => {
                    if(res.data.errcode === 0){
                        this.$message('收货成功!')
                        this.$router.go(0)
                    }
                })
            })
        }
    },
    mounted() {
        this.commitShopcartData()
        var id = this.$route.query.id
        this.id = id
        this.getOrderDetail(id)
    },
    beforeDestroy(){
        clearInterval(this.clockId)
    }
}
</script>

<style lang="less" scoped>
.main-box {
    width: 100%;
    display: flex;
    justify-content: center;

    .content-box {
        width: 75%;

        .tip-container {
            display: flex;
            align-items: center;
            height: 30px;
            line-height: 30px;
            margin: 40px 0;

            .refund-btn {
                width: 150px;
                line-height: 30px;
                text-align: center;
                background: #454B6C;
                color: #fff;
                margin-left: 40px;
                cursor: pointer;
                border-radius: 5px;
            }

            .tip {
                border-radius: 8px;
                background-color: rgba(255, 252, 212, 1);
                color: rgba(16, 16, 16, 1);
                font-size: 14px;
                text-align: center;
                font-family: Roboto;
                border: 1px solid rgba(255, 252, 212, 1);
                padding: 5px;
            }

            .time {
                color: #d81e06;
                margin-left: 18px;
            }
        }

        .border-box {
            color: #000;
            font-size: 14px;
            border: 1px solid #eeeeee;
            padding: 20px 40px;
            margin: 30px 0;

            &:last-of-type {
                margin-bottom: 100px;
            }

            .title {
                font-size: 18px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eeeeee;
            }
        }

        .status-container {
            padding-bottom: 60px;

            .header {
                color: #000;
                font-size: 15px;
                margin-bottom: 60px;

                span {
                    margin-right: 40px;
                }
            }

            .status {
                display: flex;
                justify-content: space-around;

                .status-item {
                    width: 25%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-flow: column;

                    .name {
                        font-size: 15px;
                        color: #bbbbbb;
                        font-weight: 600;
                        margin-bottom: 10px;
                        display: block;

                    }

                    .name-active {
                        color: rgb(69, 75, 108);
                    }

                    .icon-box {
                        position: relative;
                        width: 100%;
                        display: flex;
                        justify-items: center;
                        align-items: center;
                        flex-flow: column;
                        margin-bottom: 20px;

                        .status-num {
                            width: 35px;
                            height: 35px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #cecece;
                            color: #fff;
                            border-radius: 50%;
                            font-size: 13px;
                            z-index: 10;

                            span {
                                width: 27px;
                                height: 27px;
                                background: #b1b1b1;
                                border-radius: 50%;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }

                            .active {
                                background: rgb(69, 75, 108);
                            }
                        }

                        .contact-line-left,
                        .contact-line-right {
                            width: 50%;
                            height: 10px;
                            background: #cecece;
                            position: absolute;
                            top: 50%;
                            margin-top: -5px;
                            display: block;
                            z-index: 1;
                        }

                        .contact-line-left {
                            left: 0
                        }

                        .contact-line-right {
                            right: 0;
                        }
                    }

                    .time {
                        color: #b1b1b1;
                        font-size: 14px;
                        height: 20px;
                        line-height: 20px;
                    }
                }
            }
        }

        .transport-container,
        .address-container,
        .detail-container {
            .items {
                margin-top: 20px;
                font-size: 15px;

                .item {
                    line-height: 40px;
                    display: flex;

                    &:last-of-type {
                        margin-bottom: 0;
                    }

                    span:nth-of-type(1) {
                        display: flex;
                        width: 100px;
                        color: #939393;
                        font-weight: 600;
                        font-size: 14px;
                    }

                    span:nth-of-type(2) {
                        display: flex;
                        flex: 1;
                    }

                    .item-content {
                        display: flex;
                        flex: 1;
                        flex-flow: column;
                        padding-top: 10px;

                        p {
                            line-height: 18px;
                        }
                    }
                }
            }
        }

        .remark-container {
            min-height: 200px;

            .remark {
                margin-top: 20px;
                font-size: 15px;
                padding: 0 15px;
            }
        }

        .goods-list-container {
            padding: 20px 0;
            padding-bottom: 0;

            .title {
                border-bottom: 0;
                padding: 0 40px;
                padding-bottom: 20px;
            }

            .cart-list {
                font-size: 14px;
                padding: 0;
                margin: 0;

                .cart-item:last-of-type {
                    border-bottom: 0;
                }

                .cart-item,
                .cart-head {
                    display: flex;
                    align-items: center;
                    padding: 24px;
                    text-align: center;
                    border-bottom: 1px solid rgba(225, 225, 225, 1);
                    justify-content: space-between;

                    .photo {
                        width: 100px;

                        img {
                            width: 100px;
                            height: 100px;
                            background-size: cover;
                        }
                    }

                    .name {
                        width: 327px;
                        // flex: 1;
                        text-align: left;
                        margin-left: 40px;
                        text-align: center;
                    }

                    .param {
                        margin-left: 62px;
                        width: 130px;
                    }

                    .price {
                        width: 100px;
                    }

                    .num {
                        width: 120px;
                    }

                    .total {
                        width: 140px;
                    }

                    .tool {
                        width: 100px;
                    }
                }

                .cart-head {
                    height: 45px;
                    line-height: 45px;
                    background-color: rgba(229, 229, 229, 1);
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0);

                    .name {
                        text-align: center;
                    }
                }
            }
        }

        .detail-container {

            .pay-box,
            .total {
                margin-top: 20px;
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;

                span:nth-of-type(1) {
                    display: flex;
                    align-items: flex-end;
                    padding-bottom: 2px;
                }

                span:nth-of-type(2) {
                    font-size: 25px;
                    font-weight: 600;
                    color: #ff7044;
                    display: flex;
                    align-items: flex-end;
                }

            }

            .pay-box {
                .pay-button {
                    margin-left: 20px;
                    font-size: 16px;
                    padding: 5px 40px;
                    background: rgb(69, 75, 108);
                    color: #fff;
                    cursor: pointer;
                }
            }

        }
    }
}
</style>
