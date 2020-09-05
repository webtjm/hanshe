<template>
<div class="main-box">
    <ul class="status-list">
        <li class="status-item" :class="tabIdx==0?'active':''" @click="getOrdersMethod(null, 0)">全部</li>
        <li class="status-item" :class="tabIdx==1?'active':''" @click="getOrdersMethod(0, 1)">待付款</li>
        <li class="status-item" :class="tabIdx==2?'active':''" @click="getOrdersMethod(1, 2)">待发货</li>
        <li class="status-item" :class="tabIdx==3?'active':''" @click="getOrdersMethod(2, 3)">待收货</li>
        <li class="status-item" :class="tabIdx==5?'active':''" @click="getOrdersMethod(-1, 5)">退款</li>
    </ul>
    <div class="title-list-box">
        <ul class="title-list list_1">
            <li class="title-item good">商品信息</li>
            <li class="title-item price">单价（元）</li>
            <li class="title-item num">数量</li>
        </ul>
        <div class="title-item total">合计（元）</div>
        <div class="title-item status">状态</div>
        <div class="title-item tool">操作</div>
    </div>
    <ul class="order-list">
        <li class="order-item" v-for="(item, index) in orders" :key="index">
            <div class="top-content">
                <span class="order-num">订单编号：{{item.id}}</span>
                <span class="cre-time">下单时间：{{item.creTimeStr}}</span>
                <span class="rest-time" v-if="item.status == 0">剩余{{item.showClock}}结束</span>
                <span class="more" @click="toShopOrderDetail(item.id)">查看订单 ></span>
            </div>
            <div class="goods-content">
                <div class="goods-list">
                    <div class="goods-item" v-for="(good, idx) in item.shopOrderItemList" :key="idx">
                        <span class="title-content">
                            <img alt="寒舍" class="cover" :src="imgUrl + good.picture[0]">
                            <span>
                                <div class="title">{{good.title}}</div>
                                <div class="param">
                                    <span v-for="(spec, i) in good.spec" :key="i">
                                        {{spec}}
                                        <span v-if="good.spec.length!=1&&i!=good.spec.length-1">/</span>
                                    </span>
                                </div>
                            </span>
                        </span>
                        <span class="price">￥{{good.price}}</span>
                        <span class="num">{{good.num}}</span>
                    </div>
                </div>
                <div class="total">
                    <div>￥{{item.totalPrice}}</div>
                    <div>（含运费：￥ {{item.expressPrice}}）</div>
                </div>
                <div class="status">
                    <span v-if="item.status == 0">待付款</span>
                    <span v-if="item.status == 1">待发货</span>
                    <span v-if="item.status == 2">待收货</span>
                    <span v-if="item.status == 3">交易成功</span>
                    <span v-if="item.status == 4">交易关闭</span>
                    <span v-if="item.status == -2">交易关闭</span>
                    <span v-if="item.status == -1">退款中</span>
                </div>
                <div class="tool">
                    <div class="tool-btn" @click="toBuy(item.id)" v-if="item.status == 0">去付款</div>
                    <div class="tool-btn" @click="cancelBuy(index, item.id)" v-if="item.status == 0">取消订单</div>
                    <div class="tool-btn" @click="deleteOrder(item.id)" v-if="item.status==-2||item.status==3||item.status==4">删除</div>
                    <div class="tool-btn" @click="refundOrder(item.id)" v-if="item.status==1||item.status==2">申请退款</div>
                    <div class="tool-btn" @click="confirmReceive(item.id)" v-if="item.status==2">确认收货</div>
                    <div class="tool-btn" @click="checkExpress(index, item.id)" v-if="item.status==2||item.status==-1">查看物流</div>
                    <div class="tool-btn" @click="cancelRefund(item.id)" v-if="item.status==-1">取消退款</div>
                    <div class="expressMsg-box" v-if="expressBoxIdx === index">
                        <div class="title">
                            <span v-if="item.expressName">{{item.expressName}}: {{item.expressNum}}</span>
                            <span v-else>暂时没有物流信息</span>
                            <span class="hide-btn" @click="hideExpressMsgbox">收起</span>
                        </div>
                        <div class="content-box">
                            <div class="item_1">当前物流状态:</div>
                            <div class="item" v-if="expressMsg.length>0">{{expressMsg[expressMsg.length-1].AcceptStation}}</div>
                            <div class="item" v-else>暂时没有物流信息</div>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </ul>

    <div class="pagination" v-if="pageItemCount>8">
        <el-pagination background layout="prev, pager, next" :page-size="limit" :total="pageItemCount" @current-change="currentChange"></el-pagination>
    </div>
    <payWrap ref="paywrap" v-show="showPay" :price="payPrice" @order="toDetail" :url="url" />
</div>
</template>

<script>
import DateFormat from '@/config/formTime.js'
import payWrap from '@/components/public/payWrap'
import {
    mapState,
    mapActions,
    mapMutations
} from 'vuex'
export default {
    data() {
        return {
            tabIdx: 0,
            num: 1,
            currentPage: 1,
            orders: [],
            limit: 8,
            pageItemCount: 0,
            status: null,
            showPay: false,
            payPrice: 0,
            url: '',
            clocks: {},
            expressBoxIdx: -1,
            expressMsg: []
        };
    },
    methods: {
        ...mapMutations('main', [
            'setPersonalIdx',
            'setSecIdx'
        ]),
        currentChange(page) {
            this.closeInterval()
            this.currentPage = page
            this.getOrdersData(this.status)
        },
        getOrdersMethod(status, idx) {
            this.closeInterval()
            this.tabIdx = idx
            this.status = status
            this.getOrdersData(status)
        },
        getOrdersData(status) {
            console.log(status)
            status = status == null ? '' : status
            var token = localStorage.getItem('hsToken')
            this.$get(`api/findAllShopOrder?page=${this.currentPage}&limit=${this.limit}&user_id=${token}&status=${status}`)
                .then(res => {
                    if (res.data.errcode == 0) {
                        var data = []
                        this.pageItemCount = res.data.count
                        res.data.data.forEach((item, idx) => {
                            var obj = {}
                            for (var i in item) {
                                obj[i] = item[i]
                            }
                            var time = new DateFormat().setTime(obj.creTime).toString('yyyy-0m-0d 0h:0f:0s')
                            obj.creTimeStr = time
                            obj.clock = 1800
                            obj.shopOrderItemList.forEach(orderItem => {
                                orderItem.picture = orderItem.picture.split(',')
                                orderItem.spec = orderItem.spec.split(',')
                                var arr = []
                                orderItem.spec.forEach(spec => {
                                    arr.push(spec.split(':')[1])
                                })
                                orderItem.spec = arr
                            })
                            if (obj.status == 0) {
                                this.$set(this.clocks, `clock_${idx}`, '')
                                obj.showClock = this.remaining(obj.clock)
                                this.setClock(idx, obj.id, obj.creTime, obj.clock)
                            }
                            data.push(obj)
                        });
                        data = data.sort(function (a, b) {
                            return b.creTime - a.creTime;
                        })
                        this.orders = data

                        // console.log(this.orders)
                    }
                })
        },

        //创建定时器
        setClock(idx, orderId, creTime, time) {
            // console.log(creTime)
            // console.log(time)
            let initStart, start, end
            // 先清空定时器
            clearInterval()
            initStart = creTime,
                // console.log(initStart)
                // initStart = 1563852709627,
                end = initStart + time * 1000
            this.clocks[`clock_${idx}`] = setInterval(() => {
                // console.log(this.clocks[`clock_${idx}`])
                // console.log('sss')
                start = new Date().getTime()
                time = Math.floor((end - start) / 1000)
                var showTime = this.remaining(time)
                // console.log(showTime)
                // console.log(this.orders[idx])
                this.orders[idx].showClock = showTime
                this.$forceUpdate();
                // console.log(time)
                if (time < 1 || this.orders[idx].status == -1 || this.orders[idx].status == -2) {
                    //关闭订单
                    // console.log('订单失效')
                    this.closeOrder(idx, orderId)
                }
            }, 1000)
        },

        //关闭订单和定时器
        closeOrder(idx, orderId) {
            clearInterval(this.clocks[`clock_${idx}`])
            this.$axios.post('/api/cancelShopOrder?id=' + orderId).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.getOrdersData(this.status)
                }
            })
        },
        //倒计时时间格式
        remaining(time) {
            let minute = Math.floor(time / 60)
            let second = time % 60
            if (time < 0) {
                return '0分钟0秒'
            }
            return minute + '分钟' + second + '秒'
        },
        toDetail() {
            // this.setPersonalIdx(7);
            // this.setSecIdx(1)
            this.$router.push('/shop');
            // window.clearInterval(this.timer)
        },
        //关闭页面定时器
        closeInterval() {
            for (var key in this.clocks) {
                clearInterval(this.clocks[key])
            }
        },
        //去往订单详情页
        toShopOrderDetail(id) {
            this.$router.push({
                path: '/shopOrderDetail',
                query: {
                    id
                }
            })
        },
        //支付订单
        toBuy(id) {
            this.$router.push({
                name: 'orderPay',
                params: {
                    orderId: id
                }
            })
        },
        //取消订单
        cancelBuy(idx, id) {
            // console.log(idx, id)
            this.$confirm('确定取消此订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.closeOrder(idx, id)
                var obj = this.orders[idx]
                obj.clock = 0
                obj.showClock = this.remaining(obj.clock)
                this.orders[idx] = obj
            })
        },
        //删除订单
        deleteOrder(id) {
            this.$confirm('确定删除此订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.$axios.post(`api/delShopOrder?id=${id}`).then(res => {
                    if (res.data.errcode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '订单删除成功',
                            type: 'success'
                        })
                        this.getOrdersData(this.status)
                    }
                })
            })
        },
        //申请退款
        refundOrder(id) {
            this.$router.push({
                path: '/orderRefund/selectRefund',
                query: {
                    id
                }
            })
        },
        //确认收货
        confirmReceive(id) {
            this.$confirm('是否已收到您购买的商品？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.$axios.post(`api/confirmOrder?id=${id}`).then(res => {
                    if (res.data.errcode === 0) {
                        this.$message('收货成功!')
                        this.getOrdersData(this.status)
                    }
                })
            })
        },
        //取消退款
        cancelRefund(id) {
            this.$confirm('确定取消退款申请？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.$axios.post(`api/cancelRefund?id=${id}`).then(res => {
                    if (res.data.errcode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '退款申请撤销成功',
                            type: 'success'
                        })
                        this.getOrdersData(this.status)
                    }
                })
            })
        },
        //查看物流
        checkExpress(idx, id) {
            this.expressBoxIdx = idx
            this.$axios.post(`api/getExpressMsg?id=${id}`)
                .then(res => {
                    if (res.data.errcode == 0) {
                        var info = JSON.parse(res.data.data)
                        this.expressMsg = info.Traces
                    }
                })
        },
        hideExpressMsgbox() {
            this.expressBoxIdx = -1
        }
    },
    components: {
        payWrap
    },
    mounted() {
        this.getOrdersData()
    },
    beforeDestroy() {
        this.closeInterval()
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common";

.main-box {
    .pagination {
        margin: 20px 0;
        display: flex;
        justify-content: center;

        .el-pagination /deep/ .el-pager /deep/ li {
            color: #454B6C;

            &:hover {
                color: #454B6C;
            }
        }

        .el-pagination /deep/ .el-pager /deep/ .active {
            background-color: #454B6C;
            color: #fff;

            &:hover {
                color: #fff;
            }
        }
    }
}

ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.status-list {
    display: flex;
    border-bottom: 1px solid #eeeeee;
    width: 100%;

    .status-item {
        margin: 0 30px;
        width: 75px;
        height: 42px;
        line-height: 42px;
        border-radius: 0px 0px 0px 0px;
        background-color: rgba(255, 255, 255, 0);
        color: rgba(0, 0, 0, 1);
        font-size: 20px;
        text-align: center;
        font-family: Roboto;
        border: 1px solid rgba(255, 255, 255, 0);
        cursor: pointer;
    }

    .status-item.active {
        font-weight: 600;
        background-color: rgba(255, 255, 255, 1);
        color: rgba(69, 75, 108, 1);
        border-bottom: 3px solid rgba(69, 75, 108, 1);
    }
}

.title-list-box {
    margin-top: 20px;
    width: 100%;
    border: 1px solid #eeeeee;
    display: flex;
    align-items: center;

    .list_1 {
        width: 65%;
        text-align: center;
    }

    .total {
        width: 15%;
        text-align: center;
    }

    .status {
        width: 10%;
        text-align: center;
    }

    .tool {
        width: 10%;
        text-align: center;
    }
}

.title-list {
    align-content: center;
    display: flex;

    .title-item {
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

    .good {
        width: 60%;
        text-align: left;
        padding-left: 22px;
    }

    .price {
        width: 20%;
        text-align: center;
    }

    .num {
        width: 13%;
        text-align: center;
    }
}

.order-list {
    display: flex;
    width: 100%;
    flex-direction: column;

    .order-item {
        display: flex;
        flex-direction: column;
        margin-top: 17px;

        .top-content {
            display: flex;
            align-content: center;
            justify-content: space-between;
            height: 59px;
            line-height: 59px;
            border-radius: 8px 8px 0px 0px;
            background-color: rgba(238, 238, 238, 1);
            text-align: left;
            border: 1px solid rgba(255, 255, 255, 0);
            color: rgba(16, 16, 16, 1);
            font-size: 14px;

            .order-num {
                //width: 218px;
                margin-left: 22px;
            }

            .cre-time {
                // width: 206px;
                margin-left: 55px;
            }

            .rest-time {
                // width: 204px;
                color: rgba(255, 112, 68, 1);
                font-size: 18px;
                margin-left: 82px;
            }

            .more {
                cursor: pointer;
                margin-right: 22px;
            }
        }

        .goods-content {
            display: flex;
            text-align: center;

            .goods-list {
                width: 65%;

                .goods-item {
                    .title-content {
                        display: flex;
                        width: 60%;
                    }

                    display: flex;
                    align-items: center;
                    padding-top: 19px;
                    padding-bottom: 27px;
                    border-bottom: 1px solid #eeeeee;
                    border-right: 1px solid #eeeeee;
                    border-left: 1px solid #eeeeee;

                    .cover {
                        width: 102px;
                        height: 102px;
                        margin-left: 22px;
                        margin-right: 22px;
                    }

                    .title {
                        text-align: left;
                        height: 48px;
                        color: rgba(69, 75, 108, 1);
                        font-size: 16px;
                    }

                    .param {
                        text-align: left;
                        margin-top: 15px;
                    }

                    .price {
                        width: 20%;
                        text-align: center;
                    }

                    .num {
                        width: 13%;
                        text-align: center;
                    }
                }
            }

            .total {
                display: flex;
                flex-flow: column;
                justify-content: center;
                padding: 0;
                width: 15%;
                border-right: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;
            }

            .status {
                display: flex;
                flex-flow: column;
                justify-content: center;
                padding: 0;
                // width: 136px;
                width: 10%;
                border-right: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;
            }

            .tool {
                width: 10%;
                border-right: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;
                display: flex;
                flex-flow: column;
                justify-content: space-around;
                align-items: center;
                position: relative;

                .expressMsg-box {
                    position: absolute;
                    min-height: 140px;
                    width: 350px;
                    border: 1px solid #d9d9d9;
                    background: #fff;
                    left: -360px;
                    top: 50%;
                    margin-top: -70px;
                    font-size: 14px;
                    padding: 0 20px;

                    .title {
                        font-size: 14px;
                        border-bottom: 1px solid #eeeeee;
                        padding: 10px 0;
                        display: flex;
                        justify-content: space-between;

                        .hide-btn {
                            color: #454B6C;
                            font-size: 13px;
                            cursor: pointer;
                        }
                    }

                    .content-box {
                        padding: 10px 0;
                        text-align: left;

                        div {
                            margin-bottom: 5px;

                            &:last-of-type {
                                margin: 0;
                            }
                        }
                    }
                }

                .tool-btn {
                    padding: 5px 0px;
                    font-size: 14px;
                    width: 70%;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
