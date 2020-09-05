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
            <router-link :to='"/shopDetail?id"+good.id'>{{good.title}}</router-link>
        </a-breadcrumb-item>
    </a-breadcrumb>
    <div class="item-content">
        <ul class="photo-list">
            <li class="photo-item" :class="showIdx==index?'active':''" v-for="(item, index) in good.picture" :key="index" @click="showToggle(index)">
                <div class="photo bg-img" :style="`background-image:url('${imgUrl}${item}')`"></div>
            </li>
        </ul>
        <img class="big-photo" :src="imgUrl+showGoodImg" alt="寒舍">
        <div class="params-content">
            <h1 class="title">{{good.title}}</h1>
            <span class="brand">{{good.brandId}}</span>
            <span class="price">￥{{selectSpec.goodPrice}}</span>
            <span class="info-content">
                <span class="info-text">运费：</span>
                <span class="info-value">{{selectSpec.transportFare}}元</span>
            </span>
            <span class="info-content" v-for="(item, index) in good.specList" :key="index">
                <span class="info-text">{{item.name}}：</span>
                <ul class="color-list">
                    <li class="color-item" :class="selectSpecIdxs[`spec${index}`] == idx?'active':''" v-for="(val, idx) in item.val" :key="idx" @click="specToggle(index,idx)">
                        <!-- <img class="photo" src="@/assets/test/img/demo-cover.jpg" alt="寒舍"> -->
                        <span class="specVal">{{val}}</span>
                    </li>
                </ul>
            </span>
            <span class="info-content">
                <span class="info-text">数量：</span>
                <NumberInput ref="numberInput" :num="num" />
            </span>
            <div class="skuNumTip">库存数量：{{selectSpec.skuNum}}</div>
            <div class="btn-content">
                <span class="btn-buy" @click="onBtnPayTap">立即购买</span>
                <span @click="onCartTap(good.id)" class="btn-cart">加入购物车</span>
            </div>
        </div>
    </div>
    <div class="detail-content">
        <ul class="head-list">
            <li :class="['head-item', tabType==='detail'?'active':'']" @click.stop="tabToggle('detail')">商品详情</li>
            <li :class="['head-item', tabType==='params'?'active':'']" @click.stop="tabToggle('params')">商品参数</li>
        </ul>
        <div class="detail" v-html="good.content" v-if="tabType==='detail'"></div>
        <div class="detail" v-if="tabType==='params'">
            <div class="params">
                <span v-for="(item, index) in good.param" :key="index">{{item}}</span>
            </div>
        </div>
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
            good: {},
            showIdx: 0,
            showGoodImg: '',
            goodSpec: {},
            selectSpec: {
                goodsId: '',
                goodSpecId: '',
                transportFare: 0,
                goodPrice: 0,
                name: '',
                val: '',
                num: 0,
                skuNum: 0
            },
            selectSpecIdxs: {},
            tabType: 'detail'
        };
    },
    computed: {
        ...mapState('main', [
            'loginState'
        ])
    },
    methods: {
        ...mapActions('shopcart', [
            'commitGetNowPayGood'
        ]),
        tabToggle(type){
            this.tabType = type
        },
        // 加入购物车
        async onCartTap(id) {
            this.selectSpec.num = this.$refs.numberInput.currentNum
            if (this.selectSpec.num > this.selectSpec.skuNum || this.selectSpec.skuNum == 0) {
                this.$message('库存不足，请修改商品数量或选择其它商品')
                return
            }
            localStorage.setItem('nowPayGood', JSON.stringify({}))
            let {
                goodsId,
                goodSpecId,
                num
            } = this.selectSpec
            this.$axios.post(`api/addCart`, this.$qs.stringify(this.selectSpec))
                .then(res => {
                    if (res.data.errcode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '加入购物车成功，在购物车等亲~',
                            type: 'success'
                        });
                    }
                })
                .catch(err => {
                    // console.log(err)
                    this.$notify({
                        title: '失败',
                        message: '您还没有登录，请先登录!',
                        type: 'warning'
                    });
                })

        },
        // 立即购买
        onBtnPayTap() {
            this.getNowPayGood()
        },
        /**
         * ajax
         */
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
        /**
         * 获取商品详情
         */
        async getGoodDetail(id) {
            var good = await this.postData(`api/getGoodsInfo?id=${id}`)
            good.param = good.param.split(',')
            good.picture = good.picture.split(',')
            // this.$set(this.selectSpec, 'goodImg', good.picture[0])
            // this.$set(this.selectSpec, 'title', good.title)
            good.content = good.content.replace(/<img src="/, `<img alt="寒舍" src="${this.imgUrl}`)
            this.showGoodImg = good.picture[0]

            var name = []
            var val = []
            good.specList.forEach((item, i) => {
                item.val = item.val.split(',')
                name.push(item.name)
                val.push(item.val[0])
                this.$set(this.selectSpecIdxs, `spec${i}`, 0)
            })
            this.selectSpec.name = name
            this.selectSpec.val = val
            name = name.join(',')
            val = val.join(',')
            good.goodsSpecList.forEach((item, i) => {
                if (item.specId == name && item.specValId == val) {
                    this.goodSpec = item
                    this.selectSpec.goodsId = item.goodsId
                    this.selectSpec.goodSpecId = item.id
                    this.selectSpec.transportFare = item.expressPrice
                    this.selectSpec.goodPrice = item.goodsPrice
                    this.selectSpec.skuNum = item.stockNum
                }
            })
            console.log(good)
            this.good = good
        },
        /**
         * 商品图片切换
         */
        showToggle(idx) {
            this.showIdx = idx
            this.showGoodImg = this.good.picture[idx]
        },
        /**
         * 商品规格切换
         */
        specToggle(index, idx) {
            var obj1 = this.good.specList
            var obj2 = this.good.goodsSpecList
            // console.log(obj1)
            var name = []
            var val = []
            // console.log(this.selectSpecIdxs)
            obj1.forEach((item, i) => {
                if (i == index) {
                    this.selectSpecIdxs[`spec${i}`] = idx
                    var selectSpecIdx = this.selectSpecIdxs[`spec${i}`]
                }
                name.push(item.name)
                val.push(item.val[this.selectSpecIdxs[`spec${i}`]])
            })
            console.log(name, val)
            this.selectSpec.name = name
            this.selectSpec.val = val
            name = name.join(',')
            val = val.join(',')
            obj2.forEach((item, i) => {
                if (item.specId == name && item.specValId == val) {
                    this.goodSpec = item
                    this.selectSpec.goodsId = item.goodsId
                    this.selectSpec.goodSpecId = item.id
                    this.selectSpec.transportFare = item.expressPrice
                    this.selectSpec.goodPrice = item.goodsPrice
                    this.selectSpec.skuNum = item.stockNum
                }
            })
            // console.log(this.selectSpec)
        },
        //获取nowPayGood
        getNowPayGood() {
            var obj = {}
            for (var item in this.goodSpec) {
                obj[item] = this.goodSpec[item]
            }
            obj.picture = this.good.picture
            obj.title = this.good.title
            obj.specId = obj.specId.split(',')
            obj.specValId = obj.specValId.split(',')
            obj.num = this.$refs.numberInput.currentNum
            if (obj.num > this.selectSpec.skuNum || this.selectSpec.skuNum == 0) {
                this.$message('库存不足，请修改商品数量或选择其它商品')
                return
            }
            obj = JSON.stringify(obj)
            localStorage.setItem('nowPayGood', obj)
            this.$router.push("/orderConfirm");
        }
    },
    components: {
        NumberInput
    },
    mounted() {
        (
            async =>{
                console.log(this.$store)
                console.log('shopId:' + this.$route.query.id)
                var shopId = this.$route.query.id
                this.getGoodDetail(shopId)
                localStorage.setItem('nowPayGood', JSON.stringify({}))
            }
        )()
    }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/common";

.bg-img {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.container {
    font-size: 16px;
    margin: 70px auto 100px;
    width: 70%;
}

.item-content {
    display: flex;
    margin-top: 43px;

    .photo-list {

        // width: 144px;
        .photo-item.active {
            border: 2px solid #454b6c;
        }

        .photo-item {
            width: 100%;
            margin-bottom: 12px;
            display: flex;
            justify-content: center;

            .photo {
                width: 109.6px;
                height: 109.6px;
                cursor: pointer;
            }
        }
    }

    .big-photo {
        width: 596px;
        height: 596px;
        margin-left: 95px;
        background-size: cover;
    }

    .params-content {
        display: flex;
        flex-direction: column;
        margin-left: 87px;

        .info-content {
            .color-list {
                display: flex;

                .color-item {
                    padding: 5px 10px;
                    border: 1px solid #bbbbbb;
                    margin-right: 20px;
                    cursor: pointer;
                }

                .active {
                    border: 2px solid #454b6c;
                }

                .color-item {
                    .photo {
                        width: 54px;
                        height: 54px;
                        background-size: cover;
                    }
                }
            }
        }

        .title {
            color: rgba(16, 16, 16, 1);
            font-size: 24px;
        }

        .brand {
            color: rgba(0, 200, 200, 1);
            font-size: 14px;
        }

        .price {
            margin-top: 30px;
            color: rgba(16, 16, 16, 1);
            font-size: 28px;
            padding-bottom: 21px;
        }

        .material {
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            padding-top: 25px;
        }

        .size {
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            padding-bottom: 21px;
            border-bottom: 1px dotted rgba(225, 225, 225, 1);
        }

        .info-content {
            display: flex;
            align-items: center;
            margin-top: 23px;

            .info-text {
                color: rgba(16, 16, 16, 1);
                font-size: 16px;
            }

            .info-value {
                color: rgba(16, 16, 16, 1);
            }
        }

        .skuNumTip {
            margin-top: 20px;
        }

        .btn-content {
            margin-top: 76px;
            display: flex;

            .btn-buy {
                width: 149px;
                height: 39px;
                line-height: 39px;
                border-radius: 10px;
                background-color: rgba(69, 75, 108, 1);
                color: rgba(255, 255, 255, 1);
                font-size: 16px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0);
                cursor: pointer;
            }

            .btn-cart {
                width: 149px;
                height: 39px;
                line-height: 39px;
                border-radius: 10px;
                background-color: rgba(255, 255, 255, 1);
                color: rgba(69, 75, 108, 1);
                font-size: 16px;
                text-align: center;
                border: 1px solid rgba(69, 75, 108, 1);
                margin-left: 28px;
                cursor: pointer;
            }
        }
    }
}

.detail-content {
    margin-top: 100px;

    .head-list {
        width: 100%;
        height: 55px;
        background-color: #eeeeee;
        display: flex;

        .head-item {
            width: 112px;
            height: 55px;
            line-height: 55px;
            text-align: center;
            left: 292px;
            font-size: 16px;
            cursor: pointer;
            &.active{
                background: #ffffff;
                border-top: 3px solid #454b6c;
            }
        }
    }

    .detail {
        margin-top: 21px;
        margin-bottom: 76px;
        font-size: 14px;
        .params {
            padding: 0 25px;
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            display: flex;
            flex-flow: column;

            span {
                margin-bottom: 10px;

                &:last-of-type {
                    margin: 0;
                }
            }
        }
    }
}
</style>
