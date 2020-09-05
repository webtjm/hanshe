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
                <router-link to="/personal/myorder/hotelOrder">酒店订单</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item class="actived">订单详情</a-breadcrumb-item>
        </a-breadcrumb>
    </div>
    <div class="tip-container" v-if="order.payStatus===0&&order.status===3">
        <div class="tip">
            <img alt="寒舍" style="width:18px;height:18px;" src="@/assets/img/icon-attention.png">
            您需要在30分钟内完成支付，否则该订单将会被取消！
            <span class="time">{{remaining}}</span>
        </div>
    </div>
    <div class="main">
        <div class="detail">
            <div class="box">
                <span>订单编号：{{order.orderNumber}}</span>
                <span v-show="order.payStatus===0&&order.status===3">订单状态：待付款</span>
                <span v-show="order.payStatus===1&&order.status===3">订单状态：待确定</span>
                <span v-show="order.payStatus===1&&order.status===0">订单状态：待入住</span>
                <span v-show="order.payStatus===1&&order.status===1">订单状态：已入住</span>
                <span v-show="order.payStatus===2&&order.status===2">订单状态：已完成</span>
                <span v-show="order.payStatus===0&&order.status===-1">订单状态：已取消</span>
            </div>
            <a-card title="预订信息">
                <div class="line">
                    <span>房型信息</span>
                    <div>{{house.name}} - {{room.name}}</div>
                </div>
                <div class="line">
                    <span>入住时间</span>
                    <div>{{resident.residentTime}} <span>入住 -</span> {{resident.exitTime}}<span>离店</span>共{{resident.days}}晚</div>
                </div>
                <div class="line">
                    <span>房间数量</span>
                    <div>1间</div>
                </div>
                <div class="line">
                    <span>是否可取消</span>
                    <div>{{house.isCancelTime ? '' : '不'}}可取消</div>
                </div>
            </a-card>
            <a-card title="入住信息">
                <div class="line">
                    <span>住客姓名</span>
                    <div>{{resident.residentsName}}</div>
                </div>
                <div class="line">
                    <span>手机号码</span>
                    <div>{{resident.phone}}</div>
                </div>
                <div class="line">
                    <span>电子邮箱</span>
                    <div>{{resident.email}}</div>
                </div>
                <div class="line">
                    <span>入住人数</span>
                    <div>{{resident.adultNumber+resident.childNumber}}人（成人{{resident.adultNumber}}人/儿童{{resident.childNumber}}人）</div>
                </div>
                <div class="line">
                    <span>身份证号码</span>
                    <div>{{resident.identity}}</div>
                </div>
                <div class="line">
                    <span>到店时间</span>
                    <div>{{resident.arriveTime}}</div>
                </div>
                <div class="line">
                    <span>备注信息</span>
                    <div>{{resident.remarks?resident.remarks:'无'}}</div>
                </div>
                <div class="line">
                    <span>特殊需求</span>
                    <div>{{order.specialRequest?order.specialRequest:'无'}}</div>
                </div>
            </a-card>
            <a-card title="订单明细">
                <div class="line">
                    <span>房费</span>
                    <div>￥{{house.price}} X 1间</div>
                </div>
                <!-- <div class="line">
            <span>优惠信息</span>
            <div>无</div>
          </div> -->
                <div class="line">
                    <span>支付方式</span>
                    <div>{{order.payType===0?'支付宝':'微信'}}支付</div>
                </div>
                <div class="priceWrapper">
                    <span>总金额：</span>
                    <span class="sign">￥</span>
                    <span class="price">{{order.totalPrice}}</span>
                </div>
            </a-card>
        </div>
        <div class="about">
            <img alt="寒舍" :src="imgUrl+hotel.picture">
            <div class="name">{{hotel.name}}</div>
            <div class="name">{{hotel.eName}}</div>
            <div class="address">
                <div>地址：{{hotel.address}}</div>
                <div>电话：{{hotel.phone}}</div>
            </div>
            <div class="secTitle">{{house.name}}</div>
            <div class="content">床型：{{house.bedType}}</div>
            <div class="content">面积：{{house.area}}</div>
            <div class="content">接机：{{house.isAirport===1?'包含':'不包含'}}</div>
            <div class="content">早餐：{{house.isBreakfast===1?'包含':'不包含'}}</div>
            <div class="content">标准入住人数：{{house.residence}}人</div>
            <div class="secTitle">入住提示</div>
            <div class="content">
                <div>1.酒店标准入住时间为 15:00，离店时间为 12:00；</div>
                <div>2.山里寒舍所提供床位尺寸均为 1.8m×2m；</div>
                <div>3.为确保入住体验，山里寒舍按照酒店户型所对应标准居住人数做接待服务； </div>
                <div>4.3 岁以下身高不超过 90 公分视为幼儿，可享受标准居住人数内所包含的餐食，3-12 岁儿童可享受成人餐标半价；</div>
                <div>5.平日入住至少提前 7 天预订，周末入住至少提前 15 天预订，假日入住至少提前 30 天预订；为确保您的假期体验，请尽早安排订房。</div>
            </div>
            <button class="payBtn" v-if="order.payStatus===0" @click="toBuy">支付 Pay</button>
        </div>
        <pay-wrap ref="paywrap" v-show="showPay" :price="order.totalPrice" :url="url" @order="hidePayWraper" />

    </div>
</div>
</template>

<script>
import payWrap from '@/components/public/payWrap'
export default {
    data() {
        return {
            id: '',
            hotel: {},
            house: {},
            order: {},
            resident: {},
            showPay: false,
            url: '',
            remainTime: 1800,
            clockId: '',
            timer: '',
            room: {}
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
        this.$axios.post('/api/getOrderInfo?orderId=' + id).then(({
            data
        }) => {
            if (data.errcode === 0) {
                this.hotel = data.hotel
                this.house = data.house
                this.room = data.room
                this.order = data.order
                this.resident = data.resident
                this.resident.days = this.common.compareData([this.common.formatLineDate(this.resident.residentTime), this.common.formatLineDate(this.resident.exitTime)])
                this.resident.residentTime = this.common.formatDate(this.resident.residentTime)
                this.resident.exitTime = this.common.formatDate(this.resident.exitTime)
                if (this.order.status === 3&&this.order.payStatus===0) {
                    this.toClock()
                }
            } else {
                this.$message.info('出错了，请稍后再试')
            }
        }).catch(err => {
            this.$message.info('出错了，请稍后再试')
        })
    },
    methods: {
        toBuy() {
            this.$axios.post(`/api/pay?orderNo=${this.id}&price=${this.order.totalPrice}&productId=${this.house.id}`).then(({
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
        toClock() {
            let initStart, start, end
            // 先清空定时器
            clearInterval(this.clockId)
            initStart = this.order.createTime,
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
        closeOrder() {
            clearInterval(this.clockId)
            this.$axios.post('/api/cannelReserve?orderNo=' + this.id).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.$message.info('关闭订单');
                    this.order.status = -1
                }
            })

        },
        checkStatus() {
            this.timer = setInterval(async () => {
                this.$axios.post(`/api/queryOrder?orderNo=${this.id}`).then(({
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
        }
    },
    beforeDestroy() {
        window.clearInterval(this.clockId)
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

.payBtn {
    display: block;
    background-color: @color;
    width: 370px;
    height: 68px;
    border-radius: 8px;
    font-size: 26px;
    color: #fff;
    border: 0;
    margin-top: 76px !important;
}
</style>
