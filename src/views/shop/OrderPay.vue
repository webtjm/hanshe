<template>
<div class="container">
    <a-breadcrumb>
        <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
        <a-breadcrumb-item>
            <router-link to="/">HANSHE HOTEL</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
            <router-link to="/shop">商店</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
            <router-link to="/orderPay">订单支付</router-link>
        </a-breadcrumb-item>
    </a-breadcrumb>
    <div class="item-content">
        <div class="title">订单支付</div>
        <div class="item-list">
            <img alt="寒舍" class="icon" :src="imgUrl + order.picture[0]" v-if="order.picture">
            <div class="detail-content">
                <div class="detail-title">
                    <span>{{order.title}}</span><span v-for="(item, index) in order.spec" :key="index">/{{item}}</span> 等
                    <span class="num">{{goodsNum}}</span>
                    件商品
                </div>
                <div class="tip-content">
                    <div class="tip">
                        <img alt="寒舍" style="width:18px;height:18px;" src="@/assets/img/icon-attention.png">
                        您需要在30分钟内完成支付，否则该订单将会被取消！
                        <span class="time">{{remaining}}</span>
                    </div>
                    <div class="price">¥ {{orderDetail.totalPrice}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="pay-content">
        <div class="title">支付方式</div>
        <div class="pay-list">
            <!-- <div class="pay-item">
                <img alt="寒舍" class="icon-alipay" src="@/assets/img/zhifubao.png" alt>
                <img alt="寒舍" class="alipay-text" src="@/assets/img/zhifubao-text.png" alt>
            </div> -->
            <div class="pay-item">
                <img alt="寒舍" class="icon-wx" src="@/assets/img/weixin.png">
                <span class="wx-text">微信支付</span>
            </div>
        </div>
    </div>
    <div class="btn-content" @click="toBuy">
        <span class="btn-pay">支付pay</span>
    </div>
    <payWrap ref="paywrap" v-show="showPay" :price="orderDetail.totalPrice" @order="toDetail" :url="url" />
</div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations
} from 'vuex'
import payWrap from '@/components/public/payWrap'
export default {
    data() {
        return {
            remainTime: 1800,
            order: {},
            _order: [],
            clockId: '',
            lastTime: 0,
            status: 0,
            orderDetail: {},
            goodsNum: 0,
            orderId: '',
            showPay: false,
            url: '',
            timer: 0
        };
    },
    methods: {
        ...mapMutations('main', [
            'setPersonalIdx',
            'setSecIdx'
        ]),
        ...mapActions('shopcart', [
            'commitShopcartData',
            'commitDeleteShopcartData'
        ]),
        getOrderInfo(id) {
            this.$axios.post('/api/getShopOrderInfo?id=' + id).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    console.log(data)
                    this.orderDetail = data.data
                    this._order = data.orderItem
                    var num = 0
                    this._order.forEach(item => {
                        item.picture = item.picture.split(',')
                        var myspec = []
                        item.spec = item.spec.split(',')
                        item.spec.forEach(spec => {
                            var arr = spec.split(':')
                            myspec.push(arr[1])
                        })
                        item.spec = myspec
                        num = num + item.num
                    })
                    this.order = this._order[0]
                    this.goodsNum = num
                    this.toClock()
                } else {
                    this.$message.info('出错了，请稍后再试')
                }
            }).catch(err => {
                this.$message.info('出错了，请稍后再试')
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
                console.log('sss')
                start = new Date().getTime()
                this.remainTime = Math.floor((end - start) / 1000)
                if (this.remainTime < 1) {
                    this.closeOrder()
                }
            }, 1000)
        },
        closeOrder() {
            clearInterval(this.clockId)
            this.lastTime = 0
            this.$axios.post('/api/cancelShopOrder?id=' + this.orderId).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.status = -1
                    this.$notify({
                        title: '提示',
                        message: '订单关闭！',
                        type: 'warning'
                    });
                    this.$router.push('/shop')
                }
            })
        },
        toBuy() {
            this.$axios.post(`/api/pay?orderNo=${this.orderId}&price=${this.orderDetail.totalPrice}`).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.url = data.code_url
                    this.showPay = true
                    this.$nextTick(() => {
                        this.$refs.paywrap.getCode();
                        this.checkStatus()
                    })
                }
            })
        },
        checkStatus() {
            this.timer = setInterval(async () => {
                this.$axios.post(`/api/queryOrder?orderNo=${this.orderId}`).then(({
                    data
                }) => {
                    if (data.errcode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '支付成功!',
                            type: 'success'
                        });
                        this.$router.push('/personal/myorder/shopOrder');
                        window.clearInterval(this.timer)
                    }
                    console.log(data)
                })

            }, 2000)
        },
        toDetail() {
            this.$router.push('/personal/myorder/shopOrder');
            window.clearInterval(this.timer)
        },
    },
    computed: {
        ...mapState('shopcart', [
            'shopcart'
        ]),
        remaining() {
            let minute = Math.floor(this.remainTime / 60)
            let second = this.remainTime % 60
            if (this.remainTime < 0) {
                return '0分钟0秒'
            }
            return minute + '分钟' + second + '秒'
        },
        // payGoods() {
        //     var arr = []
        //     var nowPayGood = localStorage.getItem('nowPayGood')
        //     if (nowPayGood == "{}") {
        //         arr = this.shopcart
        //     } else {
        //         nowPayGood = JSON.parse(nowPayGood)
        //         arr.push(nowPayGood)
        //     }
        //     console.log(arr)
        //     return arr
        // }
    },
    mounted() {
        var id = this.$route.params.orderId
        this.orderId = id
        console.log(this.$route)
        this.commitShopcartData()
        this.getOrderInfo(id)
    },
    components: {
        payWrap
    },
    beforeDestroy() {
      clearInterval(this.clockId)
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common";

ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.container {
    font-size: 16px;
    margin: 15px auto 100px;
    width: 70%;
}

.item-content {
    margin-top: 32px;
    padding: 16px;
    border: 1px solid #eeeeee;
    border-radius: 8px;

    .title {
        color: rgba(16, 16, 16, 1);
        font-size: 20px;
        text-align: left;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 16px;
    }

    .item-list {
        display: flex;
        align-items: center;
        margin-top: 13px;

        .icon {
            width: 160px;
            height: 160px;
        }

        .detail-content {
            margin-left: 25px;
            margin-top: 13px;
            width: 100%;

            .num {
                color: #d81e06;
                font-size: 24px;
            }

            .detail-title {
                height: 41px;
                color: rgba(69, 75, 108, 1);
                font-size: 22px;
                text-align: left;
            }

            .tip-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 64px;
                width: 100%;

                .tip {
                    display: flex;
                    align-items: center;
                    height: 30px;
                    line-height: 30px;
                    border-radius: 8px;
                    background-color: rgba(255, 252, 212, 1);
                    color: rgba(16, 16, 16, 1);
                    font-size: 14px;
                    text-align: center;
                    font-family: Roboto;
                    border: 1px solid rgba(255, 252, 212, 1);

                    .time {
                        color: #d81e06;
                        margin-left: 18px;
                    }
                }

                .price {
                    color: rgba(255, 112, 68, 1);
                    font-size: 28px;
                    font-family: SourceHanSansSC-bold;
                    margin-right: 30px;
                }
            }
        }
    }
}

.pay-content {
    margin-top: 32px;
    padding: 16px;
    border: 1px solid #eeeeee;
    border-radius: 8px;

    .title {
        color: rgba(16, 16, 16, 1);
        font-size: 20px;
        text-align: left;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 16px;
    }

    .pay-list {
        display: flex;
        align-items: center;
        margin-top: 24px;
        margin-bottom: 10px;

        .pay-item {
            width: 245px;
            height: 70px;
            line-height: 70px;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0);
            text-align: center;
            margin-right: 64px;
            box-shadow:0px 2px 16px 0px rgba(69,75,108,0.5);
            .icon-alipay {
                width: 48px;
                height: 48px;
            }

            .alipay-text {
                width: 110px;
                height: 61px;
                margin-left: 14px;
            }

            .wx-text {
                display: inline-block;
                color: rgba(16, 16, 16, 1);
                font-size: 28px;
                text-align: left;
                font-family: SourceHanSansSC-bold;
                font-weight: 600;
                margin-left: 14px;
            }

            .icon-wx {
                width: 48px;
                height: 48px;
                margin-bottom: 10px;
            }
        }
    }
}

.btn-content {
    width: 100%;
    text-align: center;
    margin-top: 60px;
    margin-bottom: 60px;
}

.btn-content .btn-pay {
    display: inline-block;
    width: 300px;
    height: 68px;
    line-height: 68px;
    border-radius: 8px;
    background-color: rgba(69, 75, 108, 1);
    color: rgba(255, 255, 255, 1);
    font-size: 28px;
    text-align: center;
    font-family: Roboto;
    border: 1px solid rgba(69, 75, 108, 1);
    cursor: pointer;
}
</style>
