<template>
<div class="main-box">
    <TitleWrapper :data="title" :actived="titleIdx" @change="changeTitle" />
    <div v-if="order.length===0" class="noOrder">暂无订单</div>
    <div class="orderWrapper" v-for="(item,idx) in order" :key="item.id">
        <div class="orderTitle">
            <span>订单编号：{{item.orderNo}}</span>
            <span class="rest-time" v-if="item.payStatus===0&&item.status===0">剩余{{item.showClock}}结束</span>
            <span>预订时间：{{item.time}}</span>
        </div>
        <div class="orderContent">
            <div class="name">{{item.comboName}}</div>
            <div class="price">¥ {{item.price}}元</div>
            <div class="status">
                <!-- <div class="state" v-show="item.payStatus===0&&item.status===0">待付款</div>
          <div class="state" v-show="item.payStatus===1&&item.status===0">待使用</div>
          <div class="state" v-show="item.status===1">已使用</div>
          <div class="state" v-show="item.status===2">已完成</div>
          <div class="state" v-show="item.status===-1">已取消</div> -->
                <div class="state" v-show="item.payStatus===0&&item.status===0">待付款</div>
                <div class="state" v-show="item.payStatus===1&&item.status===1">待使用</div>
                <div class="state" v-show="item.payStatus===2&&item.status===2">已完成</div>
                <div class="state" v-show="item.payStatus===0&&item.status===-1">已取消</div>
                <div class="state" v-show="item.payStatus===1&&item.status===-2">已过期</div>
                <div class="pointer" @click="toDetail(item.orderNo)">查看详情</div>
            </div>
            <div class="btnWrapper">
                <button @click="toDetail(item.orderNo)" v-if="item.payStatus===0&&item.status===0">立即付款</button>
                <button @click="cancelOrder(item.id, idx)" v-if="item.payStatus===0&&item.status===0">取消订单</button>
                <button @click="againBuy(item.comboId)" v-if="item.status===2||item.status===-1||item.status===-2">再次购买</button>
                <button @click="delOrder(item.id, idx)" v-if="item.status===2||item.status===-1||item.status===-2">删除订单</button>

            </div>
        </div>
    </div>
    <a-pagination v-model="page" :defaultPageSize="size" :total="count" @change="changePage" />

    <a-modal :title="modalTitle" :visible="visible" @ok="handleOk" @cancel="visible=false">
        <p>{{modalText}}</p>
    </a-modal>
</div>
</template>

<script>
import Confirm from '@/components/public/Confirm'
import TitleWrapper from '@/components/personal/TitleWrapper'
import moment from 'moment'
import {
    mapMutations
} from 'vuex'
export default {
    data() {
        return {
            titleIdx: 0,
            title: ['未使用订单', '历史订单'],
            order: [],
            page: 1,
            size: 5,
            count: 1,
            modalTitle: '取消订单',
            modalText: '您是否要取消该订单？',
            visible: false,
            currentIdx: 0,
            currentId: 0,
            clocks: {},
        }
    },
    created() {
        this.getOrder();
    },
    methods: {
        ...mapMutations('main', [
            'setShowLogin'
        ]),
        changeTitle(idx) {
            this.titleIdx = idx;
            this.page = 1
            console.log(idx)
            this.getOrder();
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
                // console.log(this.order[idx])
                this.order[idx].showClock = showTime
                this.$forceUpdate();
                // console.log(time)
                if (time < 1 || this.order[idx].status == -1 || this.order[idx].status == -2) {
                    //关闭订单
                    // console.log('订单失效')
                    this.closeOrder(idx, orderId)
                }
            }, 1000)
        },

        //关闭订单和定时器
        closeOrder(idx, orderId) {
            clearInterval(this.clocks[`clock_${idx}`])
            this.$axios.post('/api/cannelCombo?id=' + orderId).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.getOrder()
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
        // 获取订单
        getOrder() {
            this.closeInterval()
            let type = this.titleIdx === 0 ? 1 : 0
            this.$axios.post(`/api/getComboOrder?type=${type}&page=${this.page}&size=${this.size}`).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.order = data.data;
                    this.count = data.count
                    this.order.forEach((item, idx) => {
                        item.time = this.common.formatDate(item.createTime)
                        // console.log(item)
                        // ----
                        if (item.payStatus===0&&item.status===0) {
                            item.clock = 1800
                            this.$set(this.clocks, `clock_${idx}`, '')
                            item.showClock = this.remaining(item.clock)
                            // console.log(item)
                            this.setClock(idx, item.id, item.createTime, item.clock)
                        }
                        // ----
                    })
                }
            }).catch(err => {
                console.log('网络出错了~~~')
            })

        },
        toDetail(id) {
            this.$router.push('/packageOrder?id=' + id)
        },
        changePage(page) {
            this.page = page
            this.getOrder()
        },
        handleOk() {
            this.visible = false
            if (this.modalTitle === '取消订单') {
                this.$axios.post('/api/cannelCombo?id=' + this.currentId).then(({
                    data
                }) => {
                    console.log(data)
                    if (data.errcode === 0) {
                        this.$message.info('取消成功')
                        this.getOrder()
                        // =-------
                        this.order[this.currentIdx].clock = 0
                        this.order[this.currentIdx].showClock = this.remaining(this.order[this.currentIdx].clock)
                        clearInterval(this.clocks[`clock_${this.currentIdx}`])
                        // ------------
                    }
                })
            } else {
                this.$axios.post('/api/deleteCombo?id=' + this.currentId).then(({
                    data
                }) => {
                    console.log(data)
                    if (data.errcode === 0) {
                        this.$message.info('删除成功')
                        this.order.splice(this.currentIdx, 1)
                    }
                })
            }
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
        againBuy(id) {
            this.$router.push('/packageDetail?id=' + id)
        }
    },
    components: {
        Confirm,
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
                    color: @color;
                    background-color: #fff;
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
