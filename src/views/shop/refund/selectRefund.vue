<template>
<div class="border" style="padding: 20px!important;flex-flow:column">
    <!-- <div class="title">请选择您要退款的商品</div> -->
    <ul class="cart-list">
        <li class="cart-item" v-for="(item, idx) in goodList" :key="idx">
            <!-- <span class="select" :class="item.select===1?'active':''" @click="selectRefundGood(idx)" v-if="orderDetail.status == 2">
                <i></i>
            </span> -->
            <span class="photo">
                <img alt="寒舍" :src="imgUrl+item.picture[0]">
            </span>
            <div class="info">
                <span class="name">{{item.title}}</span>
                <span class="spec" v-for="(spec, i) in item.spec" :key="i">{{spec}}</span>
            </div>
        </li>
    </ul>
    <div class="title" style="border: 0" v-if="orderDetail.status == 2">请选择服务类型</div>
    <div class="refunWay" v-if="orderDetail.status == 2">
        <div class="way" :class="refundWay == 0?'active':''" @click="selectRefundWay(0)">
            <img alt="寒舍" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDExNTIgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjI1IiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTExMzUuODA4IDYwNi42M2EzOS40MjQgMzkuNDI0IDAgMCAwLTU0LjkxMi04Ljg3bC02OS45MTQgNTAuMjY2QTUxNi40OCA1MTYuNDggMCAwIDAgMTAyOS4zNSA1MTJjMC0yODIuNDA2LTIyOS43OTgtNTEyLTUxMi01MTItMjgyLjM5MyAwLTUxMiAyMjkuNTk0LTUxMiA1MTJzMjI5LjgxMiA1MTIgNTEyIDUxMmE1MTAuODQ4IDUxMC44NDggMCAwIDAgMjUzLjg4OC02Ny41ODRjNC4yMjQtLjg1OCA4LjI0NC0yLjEyNSAxMi4wMzItNC40NDJhNTAwLjA0NSA1MDAuMDQ1IDAgMCAwIDYyLjc0Ni00NC4xNDcgMzkuMjMyIDM5LjIzMiAwIDAgMCA1LjI3NC01NS4zMzQgMzkuMjMyIDM5LjIzMiAwIDAgMC01NS4zMzUtNS4yODdjLTE1LjQyNCAxMi42NzItMzIuMTAyIDI0LjA3Ny00OS4yMTYgMzQuNjM3LTIuNTM0Ljg0NS01LjI3MyAxLjI4LTcuODA4IDIuNzUyLTY2Ljc1MiAzOS45MjMtMTQzLjQyNCA2MC44MjYtMjIxLjc4NSA2MC44MjZDMjc4LjA0MiA5NDUuNDIgODMuNzEyIDc1MC44ODYgODMuNzEyIDUxMlMyNzguMjQ2IDc4LjU4IDUxNy4zNSA3OC41OCA5NTAuNzg0IDI3Mi44OTUgOTUwLjc4NCA1MTJjMCA1NC4yNzItMTAuMTM4IDEwNy41Mi0yOS41NjggMTU3LjM2M0w4NjUuNjY0IDUzNS44NmEzOS4zNzMgMzkuMzczIDAgMCAwLTUxLjMyOC0yMS4xMiAzOS4wNCAzOS4wNCAwIDAgMC0yMS4xMiA1MS4zMjhsODguNSAyMTIuMjg4Yy44NDQgMi4zMTcgMi4zMTYgNC4wMDcgMy41ODMgNi4xMTkuNDIzLjY0LjQyMyAxLjI4Ljg0NSAxLjY5LjIxOC4yMTcuNDIyLjIxNy40MjIuNDIyIDMuMzggNC40NDEgNy42MDQgOC4wMjUgMTIuNDY4IDEwLjc3N2wyLjUzNCAxLjI2N2M0LjAwNiAxLjg5NSA4LjQ0OCAzLjM4IDEzLjA5NCAzLjgwMi44NDUgMCAxLjQ3Mi0uMjE4IDIuMzE3IDAgLjQyMyAwIC42NC4yMDUgMS4wNjMuMjA1YTEwLjU5OCAxMC41OTggMCAwIDAgMi41MzQtLjQyMyA1Ny4xOTUgNTcuMTk1IDAgMCAwIDguNjY2LTEuMjY3Yy42MjctLjIwNSAxLjI2Ny0uNDIyIDEuNjktLjY0YTM0LjY2IDM0LjY2IDAgMCAwIDguODctNC40MjlsMS4yNjctLjY0IDE4NS44NjktMTMzLjY5NmMxNy41MzYtMTIuODc2IDIxLjU0Mi0zNy4zNzYgOC44Ny01NC45MTJ6TTY3MC4wOCAzNDEuOTY1YTM5LjE0MiAzOS4xNDIgMCAwIDAgLjg0NS01NS41NTIgMzkuMTQyIDM5LjE0MiAwIDAgMC01NS41NTItLjg0NWwtOTguMDEgOTQuNjMtOTcuNzkyLTk0LjYzYy0xNS42MjktMTQuOTg5LTQwLjU1LTE0Ljc4NC01NS41NTIuODQ1LTE1LjAwMSAxNS42MjktMTQuNzg0IDQwLjU2My44NDUgNTUuNTUybDExMC4yNiAxMDYuNDU3djIzLjAyOGgtNzguNThjLTIxLjc2IDAtMzkuMjgzIDE3LjUzNi0zOS4yODMgMzkuMjgzIDAgMjEuNzYgMTcuNTM2IDM5LjI5NiAzOS4yOTYgMzkuMjk2aDc4LjU2NnYzOS4yODNoLTc4LjU3OWMtMjEuNzYgMC0zOS4yODMgMTcuNTM2LTM5LjI4MyAzOS4yODMgMCAyMS43NiAxNy41MzYgMzkuMjk2IDM5LjI5NiAzOS4yOTZoNzguNTY2djgyLjU3M2MwIDIxLjc2IDE3LjUzNiAzOS4yOTYgMzkuMjk2IDM5LjI5NiAyMS43NDcgMCAzOS4yODMtMTcuNTM2IDM5LjI4My0zOS4yOTZ2LTgyLjU4Nmg3OC41NjdjMjEuNzYgMCAzOS4yOTYtMTcuNTM2IDM5LjI5Ni0zOS4yOTYgMC0yMS43NDctMTcuNTM2LTM5LjI3LTM5LjI5Ni0zOS4yN2gtNzguNTY3di0zOS4yOTZoNzguNTY3YzIxLjc2IDAgMzkuMjk2LTE3LjUzNiAzOS4yOTYtMzkuMjgzIDAtMjEuNzYtMTcuNTM2LTM5LjI5Ni0zOS4yOTYtMzkuMjk2aC03OC41NjdWNDU0LjU0TDY3MC4wOCAzNDEuOTY1eiIgZmlsbD0iI2Q4MWUwNiIvPjwvc3ZnPg==">
            <div class="text-box">
                <span>我要退款（无需退货）</span>
                <p>没收到货，或与卖家协商同意不用退货，只退款</p>
            </div>
        </div>
        <div class="way" :class="refundWay == 1?'active':''" @click="selectRefundWay(1)">
            <img alt="寒舍" src="data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTUxMiAzLjAyQzIzMS41MjYgMy4wMiAzLjI3NyAyMzEuMjIgMy4yNzcgNTExLjc0NWMwIDI4MC41NzYgMjI4LjI1IDUwOC43MjMgNTA4LjcyMyA1MDguNzIzIDI4MC41NzYgMCA1MDguNzc0LTIyOC4xOTggNTA4Ljc3NC01MDguNzIzUzc5Mi41NzYgMy4wNzIgNTEyIDMuMDcyem0wIDk1Mi4wNjVjLTI0NC40MjkgMC00NDMuMjM4LTE5OC45MTItNDQzLjIzOC00NDMuMzQxUzI2Ny41NzIgNjguNDU0IDUxMiA2OC40NTRzNDQzLjM0IDE5OC44NjEgNDQzLjM0IDQ0My4yOWMwIDI0NC40MjktMTk4LjkxMSA0NDMuMzQtNDQzLjM0IDQ0My4zNHoiIGZpbGw9IiNkODFlMDYiLz48cGF0aCBkPSJNNjcxLjA3OCA2MTQuOTEybDI0LjA2NC0zNS44NGM3Ljg4NS0xMy43MjIgNC4yNS0zMC41NjYtOC4yNDMtMzcuNzg2LTEyLjQ0MS03LjE2OC0yOC45NzktMS45NDUtMzYuODY0IDExLjc3NmwtMjQuMDY0IDM1Ljg0Yy0uNjE0IDEuMDI0LS42NjUgMi4yMDItMS4xMjYgMy4yMjZsLTY0Ljk3My01MS4yYTMwLjIwOCAzMC4yMDggMCAwIDAtMTkuMzAyLTcuMTY4IDI1LjA4OCAyNS4wODggMCAwIDAtMTkuNDA1IDguNzA0Yy05LjIxNiAxMS4wMDgtNi45MTIgMjguMjExIDUuMjIyIDM4LjRsMTQ5LjYwNyAxMTcuNzZjMTIuMTM0IDEwLjI0IDI5LjQ0IDkuNTIzIDM4LjY1Ni0xLjQ4NSA5LjI2Ny0xMS4wMDggNi45MTItMjguMTYtNS4xNzItMzguNGwtNDUuMjYtMzUuNjM1YTMxLjIzMiAzMS4yMzIgMCAwIDAgNi44Ni04LjE5MnoiIGZpbGw9IiNkODFlMDYiLz48cGF0aCBkPSJNNDY4LjYzNCA3MDMuMzM0YzE1LjI1NyAwIDI3LjY0OC0xMy42NyAyNy42NDgtMzAuNDY0VjUwOS45NTJsMTk4LjI5Ny4zMDdjNC44MTMgMCA5LjI2Ny0xLjEyNiAxMy4zMTItMi45MThhMzAuMTU3IDMwLjE1NyAwIDAgMCAxOC45OTUtMjguNzc1VjMwNS4xNTJjMC0xMy4zMTItNy44ODQtMjQuNTc2LTE4LjY4OC0yOC42NzJhMzMuMjggMzMuMjggMCAwIDAtMTMuNjE5LTMuMDJsLTIyMy4xOC0uMzA4Yy0uNTEzIDAtMS4wMjUuMTAyLTEuNDg1LjE1NC0uNDEgMC0uODItLjE1NC0xLjI4LS4xNTRhMjYuMTEyIDI2LjExMiAwIDAgMC0xOC4yMjggNy43MzFsLS44Ny44MmEyNi4xMTIgMjYuMTEyIDAgMCAwLTguNSAxOS4xNDhsLjEwMyAxLjIyOS0uMTUzIDEuNTM2VjY3Mi44N2MwIDE2Ljc5NCAxMi4zOSAzMC40NjQgMjcuNjQ4IDMwLjQ2NHpNNDk2LjI4MiAzMjguNWwxNzUuMzA4LjI1NnYzNi4wOTZsLTE3NS4zMDgtLjI1NlYzMjguNXptMCA5MS4zOTJsMTc1LjMwOC4yNTZ2MzQuNzE0bC0xNzUuMzA4LS4yNTZWNDE5Ljg5em0tMTg5LjMzOC00OC4wMjVjNS40MjcgMTQuODQ4IDIwLjc4NyAyMi45MzcgMzQuMzA0IDE4LjAyMiAxMy40NjYtNC45MTUgMTkuOTY4LTIwLjk5MiAxNC42OTQtMzUuODRsLTI0LjIxNy02NGEyOC40NjcgMjguNDY3IDAgMCAwLTI2LjA2MS0xOS40NTYgMjQuMzcxIDI0LjM3MSAwIDAgMC04LjE5MiAxLjQzNGMtMTMuNTE3IDQuOTY2LTIwLjA3IDIwLjk5Mi0xNC42OTQgMzUuODRsMjQuMTY2IDY0eiIgZmlsbD0iI2Q4MWUwNiIvPjxwYXRoIGQ9Ik03NTMuNTEgNzMwLjExMkgzNTcuNTNjLjEwMi0uODcuMjU2LTEuNzQuMjU2LTIuNjYyVjQ2NS4zMDZhMjguNDE2IDI4LjQxNiAwIDAgMC0xNy41NjItMjYuOTMyIDMyLjc2OCAzMi43NjggMCAwIDAtMTUuODcyLTQuMTQ3aC01OC40MmMtMTYuODQ0IDAtMzAuNDYzIDEyLjM5LTMwLjQ2MyAyNy42NDhzMTMuNjE5IDI3LjY0OCAzMC40NjQgMjcuNjQ4aDM5Ljc4MlY3MjcuNDVjMCAuOTIxLjE1NCAxLjc5Mi4zMDcgMi42MWgtMzEuNzQ0Yy0xNS43MTggMC0yOC42NzIgMTEuNjc0LTI4LjY3MiAyNi4wMSAwIDE0LjQzOSAxMi45NTQgMjYuMTEyIDI4LjY3MiAyNi4xMTJINzUzLjUxYzE1Ljg3MiAwIDI4LjY3Mi0xMS42NzMgMjguNjcyLTI2LjExMiAwLTE0LjMzNi0xMi44LTI2LjAxLTI4LjY3Mi0yNi4wMXoiIGZpbGw9IiNkODFlMDYiLz48cGF0aCBkPSJNNTEyIC41MTJDMjMwLjA5My41MTIuNzE3IDIyOS43ODYuNzE3IDUxMS42OTIuNzE3IDc5My42IDIzMC4wOTMgMTAyMi45NzcgNTEyIDEwMjIuOTc3YzI4MS45NTggMCA1MTEuMjgzLTIyOS4zNzYgNTExLjI4My01MTEuMjgzUzc5My45MDcuNTEyIDUxMiAuNTEyem0wIDk1Ni4xMDljLTI0NS4yNDggMC00NDQuODI2LTE5OS41NzgtNDQ0LjgyNi00NDQuODc3UzI2Ni43MDEgNjYuODY3IDUxMiA2Ni44NjdzNDQ0LjkyOCAxOTkuNTc4IDQ0NC45MjggNDQ0LjkyOGMwIDI0NS4yNDgtMTk5LjYyOSA0NDQuODI2LTQ0NC45MjggNDQ0LjgyNnoiIGZpbGw9IiNkODFlMDYiLz48L3N2Zz4=">
            <div class="text-box">
                <span>退货退款</span>
                <p>已收到货，需要退款</p>
            </div>
        </div>
    </div>
    <div style="display:flex;justify-content:center">
        <div class="btn" @click="toRefund">下一步</div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            orderDetail: {},
            goodList: [],
            selectIdx: -1,
            refundWay: 0,
            id: ''
        }
    },
    methods: {
        toRefund() {
            var refundGood = []
            if (this.refundWay == -1) {
                this.$notify({
                    title: '警告',
                    message: '请选择退款方式！',
                    type: 'warning'
                });
                return
            } else {
                refundGood = this.goodList
            }
            
            refundGood = JSON.stringify(refundGood)
            localStorage.setItem('refundGood', refundGood)
            // console.log(refundGood)
            this.$router.push({
                path: '/orderRefund/refund',
                query: {
                    id: this.id,
                    refundWay: this.refundWay
                }
            })
        },
        //获取订单详情
        getOrderDetail(id) {
            this.$axios.post(`api/getShopOrderInfo?id=${id}`).then(res => {
                if (res.data.errcode === 0) {
                    // orderDetail
                    this.orderDetail = res.data.data

                    // goodList
                    var goodList = []
                    res.data.orderItem.forEach(item => {
                        item.spec = item.spec.split(',')
                        item.picture = item.picture.split(',')
                        var obj = {}
                        for (var key in item) {
                            obj[key] = item[key]
                        }
                        obj.select = 0
                        goodList.push(obj)
                    })
                    this.goodList = goodList
                    console.log(this.goodList)
                }
            })
        },
        // 选中退款商品
        selectRefundGood(idx) {
            this.goodList[idx].select = 1
        },
        // 选择退款方式
        selectRefundWay(idx) {
            this.refundWay = idx
        }
    },
    mounted() {
        var id = this.$route.query.id
        this.id = id
        this.getOrderDetail(id)
    }
}
</script>

<style lang="less" scoped>
.border {
    color: #000;
    font-size: 14px;
    border: 1px solid #eeeeee;
    padding: 20px 40px;
    margin: 30px 0;

    .title {
        font-size: 16px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eeeeee;
    }

    .cart-list {
        padding: 0;
        border-bottom: 1px solid #eeeeee;
        margin-bottom: 30px;

        .cart-item {
            display: flex;
            align-items: center;
            padding: 24px;
            text-align: center;
            justify-content: space-between;

            .active {
                border: 2px solid rgb(69, 75, 108) !important;

                i {
                    background: rgb(69, 75, 108)
                }
            }

            .select {
                width: 15px;
                height: 15px;
                border: 2px solid #bebebe;
                margin-right: 40px;
                display: flex;
                justify-content: center;
                align-items: center;

                i {
                    width: 8px;
                    height: 8px;
                    display: block;
                }
            }

            .photo {
                width: 100px;

                img {
                    width: 100px;
                    height: 100px;
                    background-size: cover;
                }
            }

            .info {
                flex: 1;
                margin-left: 40px;
                text-align: center;
                display: flex;
                flex-flow: column;
                align-items: flex-start;

                .name {
                    font-size: 15px;
                    margin-bottom: 10px;
                }

                .spec {
                    margin-bottom: 10px;

                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }

    .refunWay {
        display: flex;
        margin-bottom: 40px;

        .way {
            margin-right: 20px;
            display: flex;
            padding: 10px;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #bbbbbb;
            cursor: default;

            img {
                height: 50px;
                margin-right: 20px;
            }

            .text-box {
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: flex-start;
                width: 200px;

                span {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }

                p {
                    font-size: 12px;
                    line-height: 15px;
                    color: #bbbbbb;
                }
            }
        }

        .active {
            border: 1px solid rgb(69, 75, 108);
        }
    }

    .btn {
        width: 180px;
        line-height: 20px;
        color: #fff;
        background: rgb(69, 75, 108);
        border-radius: 5px;
        text-align: center;
        font-size: 12px;
        margin: 40px 0 40px 0;
        cursor: pointer;
    }
}
</style>
