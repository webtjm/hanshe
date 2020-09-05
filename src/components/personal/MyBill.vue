<template>
<div class="box">
    <a-table :columns="columns" :dataSource="bills" :pagination="billsPagination" @change="changeBills">
        <span slot="billType" class="count" slot-scope="billType">
            <span v-if="billType===0">酒店预订</span>
            <span v-if="billType===1">套餐购买</span>
            <span v-if="billType===2">商品购买</span>
        </span>
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
            columns: [{
                    title: "消费时间",
                    dataIndex: "createTime",
                    key: "createTime"
                },
                {
                    title: "消费项目",
                    dataIndex: "billType",
                    slots: {
                        title: "billType"
                    },
                    scopedSlots: {
                        customRender: "billType"
                    }
                },
                {
                    title: "金额",
                    dataIndex: "price",
                    key: "price",
                    slots: {
                        title: "price"
                    },
                    scopedSlots: {
                        customRender: "price"
                    }
                }
            ],
            bills: [],
            billsPagination: {
                current: 1,
                pageSize: 10,
                total: 0
            },
        }
    },
    methods: {
        async getBills() {
            let {
                data
            } = await this.$axios.get("/api/myBills", {
                params: {
                    page: this.billsPagination.current,
                    size: this.billsPagination.pageSize
                }
            });
            if (data.errcode === 0 && data.bills) {
                data.bills.forEach(item => {
                    item.createTime = formatDate(item.createTime);
                });
                this.billsPagination.total = data.pages;
            }
            this.bills = data.bills;
        },
        changeBills(e) {
            this.billsPagination = e;
            this.getBills();
        },
    },
    mounted() {
        this.getBills();
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/common.less";

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
</style>
