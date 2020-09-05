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
            <router-link to="/cart">购物车</router-link>
        </a-breadcrumb-item>
    </a-breadcrumb>
    <div class="cart-list-box">
        <ul class="edit-box">
            <li class="title-box">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </li>
            <li class="check-items">
                <el-checkbox-group v-model="checkedGoods" @change="handleCheckedGoodsChange">
                    <el-checkbox v-for="good in goodOptions" :label="good" :key="good">{{good}}</el-checkbox>
                </el-checkbox-group>
            </li>
        </ul>
        <ul class="cart-list">
            <li class="cart-head">
                <span class="photo">图片</span>
                <span class="name">商品名称</span>
                <span class="param">商品规格</span>
                <span class="price">单价</span>
                <span class="num">数量</span>
                <span class="total">小计</span>
                <span class="tool">操作</span>
            </li>
            <li class="cart-item" v-for="(item, index) in shopcart" :key="index">
                <!-- <span class="tool cursor">
                <el-checkbox v-model="item.select" v-if="showEdit"></el-checkbox>
            </span> -->
                <span class="photo">
                    <img alt="寒舍" :src="imgUrl+item.picture[0]">
                </span>
                <span class="name">{{item.title}}</span>
                <span class="param" v-for="(spec, idx) in item.specList" :key="idx">
                    <div>{{spec.name}}：{{spec.val}}</div>
                </span>
                <span class="price">¥ {{item.goodsPrice}}</span>
                <span class="num">
                    <div class="number-input-content">
                        <span class="btn-reduce" @click="onReduceTap(index)">
                            <img alt="寒舍" class="icon" src="@/assets/img/icon-reduce.png">
                        </span>
                        <input class="input-number" :value="item.num" type="number" readonly>
                        <span class="btn-add" @click="onAddTap(index)">
                            <img alt="寒舍" class="icon" src="@/assets/img/icon-add.png">
                        </span>
                    </div>
                </span>
                <span class="total">¥ {{(item.goodsPrice*item.num).toFixed(2)}}</span>
                <span class="tool cursor" @click="delectShopcart(index)">删除</span>
            </li>
        </ul>
    </div>
    <div class="bottom-content">
        <span class="btn-shop" @click="returnShop">继续购物</span>
        <span class="total-content">
            <span class="price">总计：¥{{totalprice}}</span>
        </span>
    </div>
    <div class="btn-content">
        <span class="btn-pay cursor" @click="payShopcart">立即结算</span>
    </div>
</div>
</template>

<script>
import NumberInput from "@/components/shop/NumberInput";
import {
    mapState,
    mapActions,
    mapMutations,
    mapGetters
} from "vuex"
export default {
    data() {
        return {
            num: 1,
            checkAll: false,
            checkedGoods: [],
            isIndeterminate: false,
            totalprice: 0,
            countTotal: false
        };
    },
    computed: {
        // ...mapState('main', [
        //     'loginState'
        // ]),
        ...mapState('shopcart', [
            'shopcart'
        ]),
        goodOptions() {
            var arr = []
            this.shopcart.forEach((item, i) => {
                arr.push(i)
            })
            return arr
        }
    },
    methods: {
        ...mapActions('shopcart', [
            'commitShopcartData',
            'commitChangeShopcartData',
            'commitDeleteShopcartData'
        ]),
        handleCheckAllChange(val) {
            console.log(val)
            this.checkedGoods = val ? this.goodOptions : [];
            this.isIndeterminate = false;
            //改变价格
            if (val) {
                var price = 0
                this.shopcart.forEach(item => {
                    var _price = item.goodsPrice * item.num
                    price = price + _price
                });
                this.totalprice = price.toFixed(2)
            } else {
                this.totalprice = 0
            }

        },
        handleCheckedGoodsChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.goodOptions.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.goodOptions.length;
            //改变价格
            var price = 0
            var shopcart = this.shopcart
            this.checkedGoods.forEach(idx => {
                var _price = shopcart[idx].goodsPrice * shopcart[idx].num
                price = price + _price
            });
            this.totalprice = price.toFixed(2)
        },
        // 减少商品
        onReduceTap(idx) {
            var obj = this.shopcart
            if (obj[idx].stockNum == 0) {
                this.$message('库存不足，请修改商品数量或选择其它商品')
                return
            }
            var goodSpecId = obj[idx].goodsSpecId
            if (obj[idx].num > 1) {
                obj[idx].num = obj[idx].num - 1
                var num = obj[idx].num
                this.commitChangeShopcartData({
                    goodSpecId,
                    num
                })
            }
        },

        // 增加商品
        onAddTap(idx) {
            var obj = this.shopcart
            if (obj[idx].stockNum == obj[idx].num || obj[idx].stockNum == 0) {
                this.$message('库存不足，请修改商品数量或选择其它商品')
                return
            }
            var goodSpecId = obj[idx].goodsSpecId
            obj[idx].num = obj[idx].num + 1
            var num = obj[idx].num
            this.commitChangeShopcartData({
                goodSpecId,
                num
            })
        },

        // 删除商品
        delectShopcart(idx) {
            var obj = this.shopcart[idx]
            var id = obj.id
            var specId = obj.goodsSpecId
            this.$confirm('是否删除该商品', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.commitDeleteShopcartData({
                    id,
                    specId
                })
            })
        },

        //返回商店
        returnShop() {
            this.$router.push('/shop');
        },

        //结算
        payShopcart() {
            var shopcart = []
            if (this.checkedGoods.length === 0) {
                this.$message("请选择想要购买的商品！")
                return
            } else {
                this.checkedGoods.forEach(item => {
                    if (item.stockNum < item.num) {
                        this.$message(`您购买的商品“${item.title}”库存不足，请选择其他商品`)
                        return false
                    } else {
                        shopcart.push(this.shopcart[item])
                    }
                })
            }
            shopcart = JSON.stringify(shopcart)
            localStorage.setItem('shopcart', shopcart)
            this.$router.push('/orderConfirm')
        },

        //查询用户购物车

        //ajax
        async postData(url, params) {
            let {
                data
            } = await this.$axios.post(url, params);
            if (data.errcode === 0) {
                return data.data
            } else {
                this.$message.info(data.errmsg);
                return []
            }
        },
        async getData(url, params) {
            let {
                data
            } = await this.$axios.get(url, params);
            if (data.errcode === 0) {
                return data.data
            } else {
                this.$message.info(data.errmsg);
                return []
            }
        },
    },
    components: {
        NumberInput
    },
    async mounted() {
        this.commitShopcartData()
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common";

.cursor {
    cursor: pointer;
}

ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.container {
    margin: 15px 245px;
}

.cart-list-box {
    margin-top: 40px;
    display: flex;

    .edit-box {
        display: flex;
        flex-flow: column;
        width: 100px;

        .title-box {
            height: 50px;
            background-color: rgba(229, 229, 229, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0);

            .el-checkbox /deep/ .el-checkbox__input /deep/ .el-checkbox__inner {
                width: 20px;
                height: 20px;
                border-radius: 50%;

                &::before {
                    top: 8px;
                }

                &::after {
                    height: 10px;
                    left: 7px;
                    top: 2px;
                }
            }
        }

        .check-items {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid rgba(216, 220, 230, 1);
        }

        .check-items /deep/ .el-checkbox-group {
            display: flex;
            flex-flow: column;
        }

        .check-items /deep/ .el-checkbox-group /deep/ label {
            display: flex;
            height: 148px;
            width: 100%;
            justify-content: center;
            align-items: center;

            .el-checkbox__label {
                display: none;
            }

            .el-checkbox__input /deep/ .el-checkbox__inner {
                width: 20px;
                height: 20px;
                border-radius: 50%;

                &::after {
                    height: 10px;
                    left: 7px;
                    top: 2px;
                }
            }
        }
    }
}

.cart-list {
    font-size: 14px;
    border-bottom: 1px solid rgba(225, 225, 225, 1);
    flex-grow: 1;

    .cart-item,
    .cart-head {
        display: flex;
        align-items: center;
        padding: 24px;
        text-align: center;
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
            width: 25%;
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

            .number-input-content {
                display: flex;
                align-items: center;

                .btn-add {
                    width: 31px;
                    height: 33px;
                    line-height: 31px;
                    border-radius: 0px 4px 4px 0px;
                    background-color: rgba(245, 247, 250, 1);
                    text-align: center;
                    border: 1px solid rgba(216, 220, 230, 1);
                    cursor: pointer;
                }

                .btn-reduce {
                    width: 31px;
                    height: 33px;
                    line-height: 31px;
                    border-radius: 4px 0px 0px 4px;
                    background-color: rgba(245, 247, 250, 1);
                    text-align: center;
                    border: 1px solid rgba(216, 220, 230, 1);
                    cursor: pointer;
                }

                .input-number {
                    height: 33px;
                    border: 1px solid #eeeeee;
                    border-left: 0;
                    border-right: 0;
                    text-align: center;
                    color: rgba(16, 16, 16, 1);
                    width: 68px;
                    padding-left: 12px;
                }

                .icon {
                    width: 12px;
                    height: 12px;
                }
            }
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
    }
}

.bottom-content {
    display: flex;
    justify-content: space-between;
    color: rgba(16, 16, 16, 1);
    font-size: 18px;
    margin-top: 21px;

    .price {
        margin-left: 200px;
        color: rgba(16, 16, 16, 1);
        font-size: 20px;
        font-weight: 500;
    }

    .btn-shop {
        cursor: pointer;
    }
}

.btn-content {
    margin-top: 26px;
    width: 100%;
    text-align: right;
    margin-bottom: 88px;

    .btn-pay {
        display: inline-block;
        width: 350px;
        height: 53px;
        line-height: 53px;
        text-align: center;
        background-color: rgba(69, 75, 108, 1);
        color: rgba(255, 255, 255, 1);
        font-size: 24px;
        font-family: Roboto;
        border: 1px solid rgba(255, 255, 255, 0);
    }
}
</style>
