<template>
<div class="container">
    <TitleWrapper :data="title" :actived="titleIdx" @change="changeTitle" />
    <div v-if="order.length===0" class="noOrder">暂无订单</div>
    <div class="orderWrapper" v-for="(item,idx) in order" :key="item.id">
        <div class="orderTitle">
            <span>预订编号：{{item.orderId}}</span>
            <span>预订时间：{{item.date}}</span>
        </div>
        <div class="orderContent">
            <div class="name">{{item.activityName}}</div>
            <div>
                <div class="detail">城市：{{item.cityName}}</div>
                <div class="detail">目的地：{{item.hotelName}}</div>
            </div>
            <div class="status">
                <div class="state" v-show="item.status===0">待确认</div>
                <div class="state" v-show="item.status===1">待完成</div>
                <div class="state" v-show="item.status===2">已完成</div>
                <div class="state" v-show="item.status===-1">已取消</div>
                <div @click="toDetail(item.orderId)" class="pointer">查看详情</div>
            </div>
            <div class="btnWrapper">
                <button @click="againActivty(item.id)" v-show="item.status===2||item.status===-1">再次预订</button>
                <button @click="cancelActivity(item.id, idx)" v-show="item.status===0">取消预定</button>
                <button @click="delActivity(item.id, idx)" v-show="item.status===2">删除预定</button>
            </div>
        </div>
    </div>
    <!-- <a-pagination v-model="current" :total="count" /> -->
    <a-pagination v-model="page" :defaultPageSize="size" :total="count" @change="changePage" />
    <!-- 取消订单 -->
    <a-modal :title="modelTitle" :visible="visible" @ok="handleOk" @cancel="visible=false">
        <p>{{modalText}}</p>
    </a-modal>
</div>
</template>

<script>
import Confirm from '@/components/public/Confirm'
import TitleWrapper from '@/components/personal/TitleWrapper'
import moment from "moment"

export default {
    data() {
        return {
            current: 2,
            showCancel: false,
            titleIdx: 0,
            title: ['待完成', '预订历史'],
            order: [],
            visible: false,
            modelTitle: '取消预定',
            modalText: '您是否要取消预定活动？',
            page: 1,
            size: 5,
            count: 1,
            currentIdx: 0,
            currentId: 0
        }
    },
    created() {
        this.getOrder();
    },
    methods: {
        changeTitle(idx) {
            this.titleIdx = idx;
            this.getOrder();
        },
        // 获取订单
        async getOrder() {
            let type = this.titleIdx === 0 ? 1 : 0
            this.$axios.post(`/api/getActivityOrder?type=${type}&page=${this.page}&size=${this.size}`).then(({
                data
            }) => {
                if (data.errcode === 0) {
                    this.order = data.data;
                    this.count = data.count;
                    this.order.forEach(item => {
                        item.date = moment(item.createTime).format("YYYY年MM月DD日 hh:mm")
                    })
                }
            })
        },
        toDetail(id) {
            this.$router.push('/activityOrder?id=' + id)
        },
        againActivty(id) {

        },
        cancelActivity(id, idx) {
            this.modelTitle = "取消预订"
            this.modelText = "您是否要取消预定活动？"
            this.currentId = id
            this.currentIdx = idx
            this.visible = true
        },
        delActivity(id, idx) {
            this.modelTitle = "删除预定"
            this.modelText = "您是否要删除预定活动？"
            this.currentId = id
            this.currentIdx = idx
            this.visible = true
        },
        changePage(page) {
            console.log(page)
            this.page = page
            this.getOrder()
        },
        handleOk() {
            this.visible = false
            if (this.modelTitle === '取消预订') {
                this.$axios.post('/api/cannelActivity?id=' + this.currentId).then(({
                    data
                }) => {
                    console.log(data)
                    if (data.errcode === 0) {
                        this.$message.info('取消成功')
                        this.order[this.currentIdx].status === -1
                    }
                })
            } else {
                this.$axios.post('/api/deleteActivity?id=' + this.currentId).then(({
                    data
                }) => {
                    console.log(data)
                    if (data.errcode === 0) {
                        this.$message.info('取消成功')
                        this.order.splice(this.currentIdx, 1)
                    }
                })
            }
        }
    },
    components: {
        Confirm,
        TitleWrapper
    }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/common.less';

.container {
    flex: 1;
    margin-left: 43px;
    border: 1px solid rgba(69, 75, 108, 0.15);
    font-size: 16px;
    color: #484848;
    padding: 24px 33px;
    min-width: 400px;

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
