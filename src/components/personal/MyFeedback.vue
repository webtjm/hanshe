<template>
<div class="box">
    <a-table :columns="feedColumn" :dataSource="feedBacks" :pagination="feedPagination" @change="changeFeedback">
        <!-- <span slot="count" class="count" slot-scope="text">{{text}}</span> -->
        <template slot="img" slot-scope="img">
            <div v-if="img.length===0">暂无图片</div>
            <img alt="寒舍" :src="imgUrl+item" class="feedImg" v-for="(item,idx) in img" :key="idx">
        </template>
        <template slot="view" slot-scope="view">
            <div v-if="view">已查看</div>
            <div v-else>未查看</div>
        </template>
    </a-table>
</div>
</template>

<script>
function formatDate(date) {
    let dd = new Date(date);
    return (
        dd.getFullYear() + "年" + (dd.getMonth() + 1) + "月" + dd.getDate() + "日"
    );
}
export default {
    data() {
        return {
            feedColumn: [{
                    title: "反馈时间",
                    dataIndex: "createDate",
                    key: "createDate"
                },
                {
                    title: "反馈内容",
                    dataIndex: "details",
                    key: "details"
                },
                {
                    title: "反馈图片",
                    dataIndex: "img",
                    scopedSlots: {
                        customRender: "img"
                    }
                },
                {
                    title: "状态",
                    dataIndex: "view",
                    scopedSlots: {
                        customRender: "view"
                    }
                }
            ],
            feedBacks: [],
            feedPagination: {
                current: 1,
                pageSize: 10
            },
        }
    },
    methods: {
        async getFeedback() {
            let {
                data
            } = await this.$axios.get("/api/feedback/findAll", {
                params: {
                    page: this.feedPagination.current,
                    size: this.feedPagination.pageSize
                }
            });
            if (data.errcode === 0 && data.feedBacks) {
                data.feedBacks.forEach(item => {
                    item.createDate = formatDate(item.create_date);
                    item.img = item.picture ? item.picture.split(",") : [];
                });
                this.feedPagination.total = data.pages;
                this.feedBacks = data.feedBacks;
            }
        },
        changeFeedback(e) {
            this.feedPagination = e;
            this.getFeedback();
        },
    },
    mounted() {
        this.getFeedback();
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";

.box {
    flex: 1;

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
</style>
