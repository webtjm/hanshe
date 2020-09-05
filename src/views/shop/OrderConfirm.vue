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
            <router-link to="/orderConfirm">订单确认</router-link>
        </a-breadcrumb-item>
    </a-breadcrumb>

    <div class="title-content">
        <img class="icon" src="@/assets/img/icon-order.png" alt="寒舍">
        <span class="title">填写并核对订单信息</span>
    </div>
    <div class="title-item">收货地址</div>
    <ul class="address-list">
        <li class="address-item" :class="addressActiveIdx===index||selectAddressId==item.id?'active':''" v-for="(item, index) in addressList" :key="index" @click="selctAddress(index)">
            <span class="username">{{item.username}}</span>
            <span class="mobile">{{item.moblie}}</span>
            <span class="address">{{item.province}} {{item.city}} {{item.contry}}</span>
            <span class="detail">{{item.detail}}</span>
        </li>
        <li class="address-add" @click="toMyAddress">
            <span class="icon"></span>
            <span>地址管理</span>
        </li>
    </ul>
    <div class="title-item">备注信息</div>
    <textarea class="remark" v-model="remark"></textarea>

    <ul class="cart-list">
        <li class="cart-head">
            <span class="photo">图片</span>
            <span class="name">商品名称</span>
            <span class="param">商品规格</span>
            <span class="price">单价</span>
            <span class="num">数量</span>
            <span class="total">小计</span>
        </li>
        <li class="cart-item" v-for="(item, index) in nowPayGoods" :key="index">
            <span class="photo">
                <img :src="imgUrl + item.picture[0]" alt="寒舍">
            </span>
            <span class="name">{{item.title}}</span>
            <span class="param">
                <div v-for="(spec, idx) in item.specList" :key="idx">{{spec.name}}：{{spec.val}}</div>
            </span>
            <span class="price">¥ {{item.goodsPrice}}</span>
            <span class="num">{{item.num}}</span>
            <span class="total">¥ {{item.goodsPrice * item.num}}</span>
        </li>
    </ul>
    <div class="bottom-content">
        <span class="price-content">
            小计：
            <span class="price">¥ {{littleTotal}}</span>
        </span>
        <span class="express-content">
            运费：
            <span class="price">¥ {{expressPrice}}</span>
        </span>
        <span class="total-content">
            总计：
            <span class="price">¥ {{totalPrice}}</span>
        </span>
    </div>
    <div class="btn-content">
        <span class="btn-pay" @click="onBtnPayTap">支付Pay</span>
    </div>
</div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations
} from 'vuex'
import NumberInput from "@/components/shop/NumberInput";
export default {
    data() {
        return {
            addressActiveIdx: -1,
            num: 1,
            defaultAddress: null,
            remark: '',
            selectAddressId: ''
        };
    },
    computed: {
        ...mapState('address', [
            'addressList'
        ]),
        nowPayGoods() {
            var obj = localStorage.getItem('nowPayGood')
            var confirmGoods = []
            if (obj == "{}") {
                var shopcart = localStorage.getItem('shopcart')
                shopcart = JSON.parse(shopcart)
                confirmGoods = shopcart
                confirmGoods.forEach(item => {
                    item._id = item.id
                    item.id = item.goodsSpecId
                })
            } else {
                obj = JSON.parse(obj)
                obj.specList = []
                obj.specId.forEach((spec, i) => {
                    obj.specList.push({
                        name: spec,
                        val: obj.specValId[i]
                    })
                })
                confirmGoods.push(obj)
            }
            console.log(confirmGoods)
            return confirmGoods
        },
        littleTotal() {
            var price = 0
            this.nowPayGoods.forEach(item => {
                price = price + (item.goodsPrice * item.num)
            })
            return price.toFixed(2)
        },
        expressPrice() {
            var price = 0
            this.nowPayGoods.forEach(item => {
                price = price + item.expressPrice
            })
            return price.toFixed(2)
        },
        totalPrice() {
            return (parseFloat(this.expressPrice)+parseFloat(this.littleTotal)).toFixed(2)
        },
    },
    methods: {
        ...mapMutations('main', [
            'setPersonalIdx',
            'setSecIdx'
        ]),
        ...mapActions('shopcart', [
            'commitDeleteShopcartData'
        ]),
        ...mapActions('address', [
            'commitGetAddressData'
        ]),
        //选中地址
        selctAddress(idx) {
            this.selectAddressId = ''
            this.addressActiveIdx = idx
            this.defaultAddress = this.addressList[idx]
        },
        onBtnPayTap() {
            if (!this.defaultAddress) {
                this.$message('请选择收货地址')
                return
            }
            var shopOrderItemList = []
            var token = localStorage.getItem('hsToken')
            var storage = localStorage.getItem('nowPayGood')
            this.nowPayGoods.forEach(item => {
                var specList = []
                if (storage == "{}") {
                    specList = item.specList
                } else {
                    item.specId.forEach((ele, i) => {
                        specList.push({
                            name: ele,
                            val: item.specValId[i]
                        })
                    });
                }

                var spec = []
                specList.forEach(ele => {
                    spec.push(ele.name + ':' + ele.val)
                })

                var obj = {
                    goodsId: item.goodsId,
                    goodsSpecId: item.id,
                    picture: item.picture.join(','),
                    title: item.title,
                    specList: specList,
                    spec: spec.join(','),
                    num: item.num
                }
                shopOrderItemList.push(obj)
            })

            var order = {
                username: this.defaultAddress.username,
                moblie: this.defaultAddress.moblie,
                province: this.defaultAddress.province,
                city: this.defaultAddress.city,
                region: this.defaultAddress.contry,
                address: this.defaultAddress.detail,
                totalPrice: this.totalPrice,
                remark: this.remark,
                shopOrderItemList,
            }
            this.$axios.post('api/buyGoods', this.$qs.parse(order), {
                headers: {
                    'token': token
                }
            }).then(res => {
                var orderId = res.data.data
                // console.log(orderId)
                //清空购物车选中的商品
                if (storage === '{}') {
                    console.log(this.nowPayGoods)
                    this.nowPayGoods.forEach((item, i) => {
                        var id = item._id
                        var specId = item.goodsSpecId
                        var showMsg = false
                        this.commitDeleteShopcartData({
                            id,
                            specId,
                            showMsg
                        })
                    })
                }
                this.$router.push({
                    name: 'orderPay',
                    params: {
                        orderId,
                    }
                });
            })
        },
        //获取默认地址
        getDefaultAddress() {
            var token = localStorage.getItem('hsToken')
            this.$axios.get(`api/getDeAddress`, {
                headers: {
                    'token': token
                }
            }).then(res => {
                // console.log(res.data.data)
                if (res.data.errcode == 0) {
                    this.defaultAddress = res.data.data
                    this.selectAddressId = this.defaultAddress.id
                }
            })
        },

        //重定向到地址管理
        toMyAddress() {
            this.$router.push('/personal/addressManage/myAddress')
        }
    },
    components: {
        NumberInput
    },
    mounted() {
        // this.commitShopcartData()
        this.getDefaultAddress()
        this.commitGetAddressData()
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

.title-content {
    display: flex;
    margin-top: 28px;
    align-items: center;

    .icon {
        width: 35px;
        height: 35px;
    }

    .title {
        margin: 0;
        color: rgba(16, 16, 16, 1);
        font-size: 20px;
        // font-family: SourceHanSansSC-bold;
        margin-left: 16px;
    }
}

.title-item {
    height: 27px;
    line-height: 27px;
    color: rgba(16, 16, 16, 1);
    font-size: 18px;
    margin: 26px 0;
}

.address-list {
    display: flex;
    flex-wrap: wrap;

    li {
        box-sizing: border-box;
    }

    .address-item {
        width: 265px;
        display: flex;
        flex-direction: column;
        border: 1px solid #eeeeee;
        margin-right: 11px;
        margin-bottom: 20px;
        padding: 15px;
        width: 265px;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: left;
        cursor: pointer;

        // font-family: SourceHanSansSC-bold;
        .username {
            font-weight: 600;
            line-height: 30px;
        }

        .mobile,
        .address,
        .detail {
            line-height: 30px;
        }

        .btn-content {
            width: 100%;
            color: rgba(58, 37, 123, 1);
            font-size: 14px;
            text-align: right;
            font-family: SourceHanSansSC-regular;
            line-height: 30px;

            .btn-default {
                margin-left: 16px;
            }
        }
    }

    .active {
        border: 2px solid #bbbbbb;
    }

    .address-add:hover {
        border: 1px solid #3a257b;
        color: #3a257b;

        .icon {
            content: url("../../assets/img/icon-address-add-active.png");
        }
    }

    .address-add {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        justify-content: center;
        border: 1px solid #eeeeee;
        margin-right: 11px;
        margin-bottom: 20px;
        width: 265px;
        font-size: 14px;
        height: 180px;
        color: #101010;
        cursor: pointer;

        .icon {
            width: 50px;
            height: 50px;
            margin-bottom: 13px;
            content: url("../../assets/img/icon-address-add.png");
        }
    }
}

.remark {
    width: 100%;
    height: 164px;
    line-height: 20px;
    color: rgba(136, 136, 136, 1);
    font-size: 18px;
    text-align: left;
    font-family: Microsoft Yahei;
    border: 1px solid rgba(187, 187, 187, 1);
    border-radius: 20px;
    padding: 20px;
    resize: none;
}

.remark:focus {
    outline: none;
}

.cart-list {
    margin-top: 40px;
    font-size: 14px;
    border: 1px solid rgba(225, 225, 225, 1);
    border-bottom: 0px;

    .cart-item,
    .cart-head {
        display: flex;
        align-items: center;
        padding: 24px;
        text-align: center;
        border-bottom: 1px solid rgba(225, 225, 225, 1);
        justify-content: space-between;

        .photo {
            width: 100px;

            img {
                width: 100px;
                height: 100px;
                background-size: cover;
            }
        }

        .name {
            width: 327px;
            // flex: 1;
            text-align: left;
            margin-left: 40px;
        }

        .param {
            margin-left: 62px;
            width: 130px;
        }

        .price {
            width: 100px;
        }

        .num {
            width: 120px;
        }

        .total {
            width: 140px;
        }

        .tool {
            width: 100px;
        }
    }

    .cart-head {
        height: 45px;
        line-height: 45px;
        background-color: rgba(229, 229, 229, 1);
        text-align: center;
        border: 1px solid rgba(255, 255, 255, 0);

        .name {
            text-align: left;
        }
    }
}

.bottom-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    padding-bottom: 38px;
    border-bottom: 1px solid rgba(225, 225, 225, 1);

    .price-content {
        width: 100%;
        text-align: right;
        color: rgba(16, 16, 16, 1);
        font-size: 20px;

        .price {
            color: rgba(16, 16, 16, 1);
            font-size: 20px;
            margin-left: 180px;
            font-weight: 600;
        }
    }

    .express-content {
        color: rgba(16, 16, 16, 1);
        font-size: 20px;
        margin-top: 18px;

        .price {
            color: rgba(16, 16, 16, 1);
            font-size: 20px;
            margin-left: 180px;
            font-weight: 600;
        }
    }

    .total-content {
        color: rgba(16, 16, 16, 1);
        font-size: 28px;
        margin-top: 17px;

        .price {
            margin-left: 143px;
            color: rgba(255, 112, 68, 1);
            font-size: 28px;
        }
    }

    .express-content {
        width: 100%;
        text-align: right;
    }

    .total-content {
        width: 100%;
        text-align: right;
    }
}

.btn-content {
    margin-top: 38px;
    width: 100%;
    text-align: right;

    .btn-pay {
        display: inline-block;
        border-radius: 5px;
        width: 351px;
        height: 60px;
        line-height: 60px;
        background-color: rgba(69, 75, 108, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 24px;
        text-align: center;
        font-family: Roboto;
        border: 1px solid rgba(255, 255, 255, 0);
        cursor: pointer;
    }
}
</style>
