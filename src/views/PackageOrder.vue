<template>
<div>
    <div class="breadCrumb">
        <a-breadcrumb>
            <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/">HANSHE HOTEL</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/personal">个人中心</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <router-link to="/personal/myorder/packageOrder">套餐订单</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item class="actived">订单详情</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
    <div class="tip-container" v-if="data.payStatus===0&&data.status===0">
        <div class="tip">
            <img alt="寒舍" style="width:18px;height:18px;" src="@/assets/img/icon-attention.png">
            您需要在30分钟内完成支付，否则该订单将会被取消！
            <span class="time">{{remaining}}</span>
        </div>
    </div>
    <div class="main">
        <div class="detail">
            <div class="box">
                <span>订单编号：{{data.orderNo}}</span>
                <!-- <span v-show="data.payStatus===0&&data.status===0">套餐状态：待付款</span>
          <span v-show="data.payStatus===1&&data.status===0">套餐状态：待使用</span>
          <span v-show="data.status===1">套餐状态：已使用</span>
          <span v-show="data.status===2">套餐状态：已完成</span>
          <span v-show="data.status===-1">套餐状态：已取消</span> -->
                <span v-show="data.payStatus===0&&data.status===0">套餐状态：待付款</span>
                <span v-show="data.payStatus===1&&data.status===1">套餐状态：待使用</span>
                <span v-show="data.payStatus===1&&data.status===-2">套餐状态：已过期</span>
                <span v-show="data.payStatus===2&&data.status===2">套餐状态：已完成</span>
                <span v-show="data.payStatus===0&&data.status===-1">套餐状态：已取消</span>
            </div>
            <a-card title="套餐信息">
                <div class="line">
                    <span>套餐名称</span>
                    <div>{{combo.name}}</div>
                </div>
                <div class="line">
                    <span>套餐类型</span>
                    <div>{{combo.type===0?'乐享套餐':'普通套餐'}}</div>
                </div>
                <div class="line">
                    <span>下单时间</span>
                    <div>{{data.time}}</div>
                </div>
                <div class="line">
                    <span>卡号</span>
                    <div>
                        {{data.cardNumber}}
                        <span @click="seeCard" v-if="combo.type===0" style="color:#409EFF;cursor:pointer;">查看我的乐享卡 ></span>
                    </div>
                </div>
                <div class="line">
                    <span>有效期</span>
                    <div>{{combo.validityDate}}</div>
                </div>
                <div class="line">
                    <span>使用次数</span>
                    <div>{{combo.useNumber}}次</div>
                </div>
                <div class="line">
                    <span>人数</span>
                    <div>{{combo.peopleNumber}}人</div>
                </div>
                <div class="line">
                    <span>天数</span>
                    <div>{{combo.vaildity}}天</div>
                </div>
                <div class="line">
                    <span>使用城市</span>
                    <div>{{combo.city}}</div>
                </div>
                <div class="line">
                    <span>使用目的地</span>
                    <div>{{combo.hotelName}}</div>
                </div>
            </a-card>
            <a-card title="订单明细">
                <div class="line">
                    <span>套餐费</span>
                    <div>￥{{data.price}}</div>
                </div>
                <!-- <div class="line">
            <span>优惠信息</span>
            <div>{{data.preferentialInformation}}</div>
          </div> -->
                <div class="line">
                    <span>支付方式</span>
                    <div>{{data.payType===0?'支付宝':'微信'}}支付</div>
                </div>
                <div class="priceWrapper">
                    <span>总金额：</span>
                    <span class="sign">￥</span>
                    <span class="price">{{data.price}}</span>
                </div>
            </a-card>
        </div>
        <div class="about">
            <img alt="寒舍" :src="imgUrl+combo.picture">
            <div class="name">
                {{combo.name}}
            </div>
            <div class="content">
                <span v-html="combo.introduction"></span>
                <span class="lookMore" @click="toPackage(combo.id)">查看更多</span>
            </div>
            <button class="payBtn" v-if="data.payStatus===0&&data.status===0" @click="toBuy">支付 Pay</button>
        </div>
        <pay-wrap ref="paywrap" v-show="showPay" :price="data.price" :url="url" @order="hidePayWraper" />
    </div>
</div>
</template>

<script>
import {
    mapMutations
} from 'vuex'
import payWrap from '@/components/public/payWrap'
export default {
    data() {
        return {
            id: '',
            data: {
                picture: ''
            },
            combo: {},
            showPay: false,
            url: '',
            remainTime: 1800,
            clockId: '',
            timer: '',
            url: '',

        }
    },
    computed: {
        remaining() {
            let minute = Math.floor(this.remainTime / 60)
            let second = this.remainTime % 60
            if (this.remainTime < 0) {
                return '0分钟0秒'
            }
            return minute + '分钟' + second + '秒'
        },
    },
    created() {
        let {
            id
        } = this.$route.query;
        this.id = id;
        this.getDetail()
    },
    methods: {
        ...mapMutations('main', [
            'setPersonalIdx'
        ]),
        // 获取订单
        async getDetail() {
            let {
                data
            } = await this.$axios.post("/api/getComboOrderInfo?orderId=" + this.id);
            if (data.errcode === 0) {
                this.data = data.data
                data.combo.validityDate = this.common.validityDate(data.data.createTime, data.combo.vaildity)
                this.combo = data.combo
                let date = new Date(this.data.createTime)
                if (this.data.status === 0 && this.data.payStatus === 0) {
                    this.toClock()
                }
                this.data.time = date.toLocaleString()
            }
        },
        toClock() {
            let initStart, start, end
            // 先清空定时器
            clearInterval(this.clockId)
            initStart = this.data.createTime,
                console.log(initStart)
            // initStart = 1563852709627,
            end = initStart + this.remainTime * 1000
            this.clockId = setInterval(() => {
                // console.log('sss')
                start = new Date().getTime()
                this.remainTime = Math.floor((end - start) / 1000)
                if (this.remainTime < 1) {
                    this.closeOrder()
                }
            }, 1000)
        },
        toBuy() {
            let id = 3
            this.$axios.post(`/api/pay?orderNo=${this.data.orderNo}&price=${this.data.price}&productId=${id}`).then(({
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
        closeOrder() {
            window.clearInterval(this.clockId)
            this.remainTime = 0
            this.data.status = -1
            this.$axios.post('/api/cannelCombo?id=' + this.data.id).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.$message.info('关闭订单');
                }
            })
        },
        checkStatus() {
            this.timer = setInterval(async () => {
                this.$axios.post(`/api/queryOrder?orderNo=${this.data.orderNo}`).then(({
                    data
                }) => {
                    if (data.errcode === 0) {
                        this.showPay = false
                        this.$message.info('支付成功')
                        window.clearInterval(this.timer)
                    }
                })
            }, 2000)
        },
        hidePayWraper() {
            window.clearInterval(this.timer)
            this.showPay = false
        },
        toPackage(id) {
            this.$router.push('/packageDetail?id=' + id)
        },
        seeCard() {
            // this.setPersonalIdx(5);
            this.$router.replace('/personal/myCard/cardDetail');
        }
    },
    beforeDestroy() {
        window.clearInterval(this.clockId)
        window.clearInterval(this.timer)
    },
    components: {
        payWrap
    }
}
</script>

<style lang="less" scoped>
@import "../assets/less/main.less";

.tip-container {
    display: flex;
    align-items: center;
    height: 30px;
    line-height: 30px;
    margin: 20px 0;
    margin-left: 15%;

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
        display: flex;
        align-items: center;

    }

    .time {
        color: #d81e06;
        margin-left: 18px;
    }
}
</style>
