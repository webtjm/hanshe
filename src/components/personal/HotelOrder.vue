<template>
<div class="main-box">
    <TitleWrapper :data="title" :actived="titleIdx" @change="changeTitle" />
    <div v-if="hotelOrder.length===0" class="noOrder">暂无订单</div>
    <div class="orderWrapper" v-for="(item,idx) in hotelOrder" :key="item.id">
        <div class="orderTitle">
            <span>订单编号：{{item.orderId}}</span>
            <span class="rest-time" v-if="item.payStatus===0&&item.status===3">剩余{{item.showClock}}结束</span>
            <span>预订时间：{{item.createTimeStr}}</span>
        </div>
        <div class="orderContent">
            <div>
                <div class="name">{{item.name}} {{item.eName}}</div>
                <div class="detail">{{item.houseName}} - {{item.roomName}} （1间）</div>
                <div class="detail">{{item.residentTime}}<span>入住 -</span> {{item.exitTime}}<span>离店</span>共{{item.days}}晚</div>
            </div>
            <div class="price">¥ {{item.price}}元</div>
            <div class="status">
                <div class="state" v-show="item.payStatus===0&&item.status===3">待付款</div>
                <div class="state" v-show="item.payStatus===1&&item.status===3">待确定</div>
                <div class="state" v-show="item.payStatus===1&&item.status===0">待入住</div>
                <div class="state" v-show="item.payStatus===1&&item.status===1">已入住</div>
                <div class="state" v-show="item.payStatus===2&&item.status===2">已完成</div>
                <div class="state" v-show="item.payStatus===0&&item.status===-1">已取消</div>
                <div class="pointer" @click="toDetail(item.orderId)">查看详情</div>
            </div>
            <div class="btnWrapper">
                <button v-if="item.payStatus===0&&item.status===3" @click="toDetail(item.orderId)">立即付款</button>
                <button v-if="item.payStatus===0&&item.status===0" @click="cancelOrder(item.orderId, idx)">取消订单</button>
                <button v-if="item.status===2||item.status===-1" @click="againOrder(item.hotelId)">再次预定</button>
                <button v-if="item.status===2||item.status===-1" @click="delOrder(item.id, idx)">删除订单</button>
            </div>
        </div>
    </div>
    <a-pagination v-model="page" :defaultPageSize="size" :total="count" @change="changePage" />
    <!-- 取消订单 -->
    <a-modal :title="modelTitle" :visible="visible" @ok="handleOk" @cancel="visible=false">
        <p>{{ModalText}}</p>
    </a-modal>
</div>
</template>

<script>
import TitleWrapper from '@/components/personal/TitleWrapper'
import DateFormat from '@/config/formTime.js'
import moment from 'moment'
import {
    mapMutations
} from 'vuex'
export default {
    data() {
        return {
            showCancel: false,
            titleIdx: 0,
            title: ['未入住订单', '历史订单'],
            hotelOrder: [],
            modelTitle: '取消订单',
            visible: false,
            ModalText: '您是否要取消订单？',
            page: 1,
            size: 5,
            count: 1,
            currentIdx: 0,
            currentId: 0,
            clocks: {},
        }
    },
    created() {
        this.getHotelOrder();
    },
    methods: {
        ...mapMutations('main', [
            'setShowLogin'
        ]),
        changeTitle(idx) {
            this.titleIdx = idx;
            this.getHotelOrder();
        },
        //创建定时器
        setClock(idx, orderId, createTime, time) {
            // console.log(createTime)
            // console.log(time)
            let initStart, start, end
            // 先清空定时器
            clearInterval()
            initStart = createTime,
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
                // console.log(this.hotelOrder[idx])
                this.hotelOrder[idx].showClock = showTime
                this.$forceUpdate();
                // console.log(time)
                if (time < 1 || this.hotelOrder[idx].status == -1 || this.hotelOrder[idx].status == -2) {
                    //关闭订单
                    // console.log('订单失效')
                    this.closeOrder(idx, orderId)
                }
            }, 1000)
        },

        //关闭订单和定时器
        closeOrder(idx, orderId) {
            clearInterval(this.clocks[`clock_${idx}`])
            this.$axios.post('/api/cannelReserve?orderNo=' + orderId).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.getHotelOrder()
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
        //关闭页面定时器
        closeInterval() {
            for (var key in this.clocks) {
                clearInterval(this.clocks[key])
            }
        },
        // 获取酒店订单
        getHotelOrder() {
            this.closeInterval()
            let type = this.titleIdx === 0 ? 1 : 0;
            this.$axios.post(`/api/getAllOrder?type=${type}&page=${this.page}&size=${this.size}`).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.hotelOrder = data.data;
                    this.count = data.count
                    this.hotelOrder.forEach((item, idx) => {
                        // item.createTime = this.common.formatDate(item.createTime)
                        item.createTimeStr = moment(item.createTime).format('YYYY-MM-DD hh:mm')
                        item.days = this.common.compareData([this.common.formatLineDate(item.residentTime), this.common.formatLineDate(item.exitTime)])
                        item.exitTime = this.common.formatDate(item.exitTime)
                        item.residentTime = this.common.formatDate(item.residentTime)
                        // ----
                        if (item.payStatus===0&&item.status===3) {
                            item.clock = 1800
                            this.$set(this.clocks, `clock_${idx}`, '')
                            item.showClock = this.remaining(item.clock)
                            console.log(item)
                            this.setClock(idx, item.orderId, item.createTime, item.clock)
                        }
                        // ----
                        return item
                    })
                }
            }).catch(err => {
                // this.setShowLogin(true);
                this.$message.info("网络出错了~~~");
            })

        },
        toDetail(id) {
            this.$router.push('/orderDetail?id=' + id)
        },
        cancelOrder(id, idx) {
            this.modalTitle = "取消订单"
            this.modalText = '您是否要取消该订单？'
            this.currentIdx = idx
            this.currentId = id
            this.visible = true
        },
        delOrder(id, idx) {
            this.modalTitle = "删除订单"
            this.modalText = '您是否要删除该订单？'
            this.currentIdx = idx
            this.currentId = id
            this.visible = true
        },
        handleOk() {
            this.visible = false
            let item = this.hotelOrder
            if (this.modalTitle === '取消订单') {
                this.$axios.post('/api/cannelReserve?orderNo=' + this.currentId).then(({
                    data
                }) => {
                    if (data.errcode === 0) {
                        this.$message.info('取消成功')
                        this.hotelOrder[this.currentIdx].status = -1
                        // =-------
                        this.hotelOrder[this.currentIdx].clock = 0
                        this.hotelOrder[this.currentIdx].showClock = this.remaining(this.hotelOrder[this.currentIdx].clock)
                        clearInterval(this.clocks[`clock_${this.currentIdx}`])
                        // ------------
                    }
                })
            } else {
                this.$axios.post('/api/deleteReserve?id=' + this.currentId).then(({
                    data
                }) => {
                    console.log(data)
                    if (data.errcode === 0) {
                        this.$message.info('删除成功')

                        this.hotelOrder.splice(this.currentIdx, 1)
                    }
                })
            }
        },
        againOrder(id) {
            this.$router.push('/singleStore?id=' + id)
        },

        changePage(page) {
            this.closeInterval()
            console.log(page)
            this.page = page
            this.getHotelOrder()
        }
    },
    components: {
        TitleWrapper
    },
    beforeDestroy() {
        this.closeInterval()
    }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';

.main-box {
    flex: 1;
    min-width: 700px;

    .noOrder {
        padding: 30px;
        text-align: center;
    }

    .orderWrapper {
        padding: 0 30px;
        border: 1px solid rgba(69, 75, 108, 0.15);
        border-radius: 8px;
        margin-top: 17px;

        .orderTitle {
            font-size: 16px;
            color: #cacaca;
            padding-bottom: 10px;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid rgba(141, 141, 141, 0.4);
        }

        .orderContent {
            padding: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .name {
                color: @color;
                font-size: 22px;
                font-weight: bolder;
                flex: 1;
            }

            .detail {
                line-height: 40px;

                span {
                    color: #8E8E8E;
                }
            }

            .price {
                color: #C80000;
                font-size: 16px;
            }

            .status {
                color: #8D8D8D;
                font-size: 14px;
                text-align: center;
                padding: 0 50px;

                .state {
                    color: #484848;
                    margin-bottom: 10px;
                }
            }

            .btnWrapper {
                width: 130px;

                button:first-child {
                    background-color: #FF7044;
                    color: #fff;
                    font-size: 14px;
                    padding: 6px 26px;
                    border-radius: 8px;
                    border: 0;
                    margin-bottom: 10px;
                }

                button {
                    background-color: #fff;
                    color: @color;
                    font-size: 14px;
                    padding: 6px 26px;
                    border-radius: 8px;
                    border: 0;
                }
            }
        }
    }

    .ant-pagination {
        text-align: center;
        margin: 20px auto;

        .ant-pagination-item-active {
            background-color: @color;
            color: #fff;
            border: 0;
        }
    }
}
</style>
