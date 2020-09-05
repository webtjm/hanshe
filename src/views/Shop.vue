<template>
<div @mouseover.self="hoverBoxShow = false">
    <div class="carousel">
        <el-carousel trigger="click" height="100%" width="100%" class="carousel" indicator-position="none">
            <el-carousel-item v-for="item in carousels" :key="item">
                 <img alt="寒舍" :src="imgUrl+item">
            </el-carousel-item>
        </el-carousel>
    </div>
    <div class="container">
        <!-- 一级分类 -->
        <div class="top-category-list-box">
            <ul class="top-category-list" @mouseover.self="hoverBoxShow = false">
                <li v-for="(item, index) in topCateList" :key="index" :class="topCateAct==index?'top-category-item active':'top-category-item'">
                     <img alt="寒舍" :src="imgUrl + (topCateAct==index?item.iconAct:item.icon)">
                    <span v-if="item.name">{{item.name}}</span>
                    <div class="li-cover" @mouseover.stop="showHoverLiBox(item.id)"></div>
                    <!-- @click="onTopCategoryItemTap(index, item.id)" -->
                </li>
            </ul>
            <transition name="fade">
                <div class="hover-list-box" v-if="hoverBoxShow">
                    <div class="list-box-left">
                        <div class="title">商品分类</div>
                        <ul class="hover-category-list">
                            <li class="item" @click="hoverGetAllGoodsData">全部</li>
                            <li class="item" v-for="(item, idx) in hoverCategoryList" :key="idx" @click="toggleCategory(item.parentId, item.id, idx)">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="list-box-right">
                        <div class="title">热门商品</div>
                        <div class="goods-list">
                            <div class="good-box" v-for="item in hotGoods" :key="item.id" @click="onShopItemTap(item.id)">
                                <div class="imgBox">
                                     <img alt="寒舍" :src="imgUrl+item.picture">
                                </div>
                                <span class="name">{{item.title}}</span>
                                <span class="price">￥{{item.goodsPrice}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <!-- 一级分类 end-->
        <!-- 标题栏 -->
        <div class="head-content">
            <a-breadcrumb>
                <a-breadcrumb-item>当前位置：</a-breadcrumb-item>
                <a-breadcrumb-item>
                    <router-link to="/">HANSHE HOTEL</router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>
                    <router-link to="/shop">商店</router-link>
                </a-breadcrumb-item>
                <a-breadcrumb-item>
                    <router-link to="/shop?topCateAct" v-if="topCateList[topCateAct]">{{topCateList[topCateAct].name}}</router-link>
                </a-breadcrumb-item>
            </a-breadcrumb>
            <div class="search-content">
                <div class="input-content">
                    <input class="search-input" type="text" autocomplete="new-password" placeholder="请输入搜索关键字" v-model="filters.goodName" />
                     <img alt="寒舍" class="icon-search" src="@/assets/img/icon-search.png" @click="getGoodsToName">
                </div>
                <span @click="onCartTap()" class="cart-text">购物车</span>
                <div style="position: relative">
                     <img alt="寒舍" @click="onCartTap()" class="icon-cart" src="@/assets/img/icon-cart.png">
                    <span class="shopcart-num" v-if="shopcartNum > 0">{{shopcartNum}}</span>
                </div>
            </div>
        </div>
        <!-- 标题栏end -->
        <!-- 商品栏 -->
        <div class="shop-content loading-area" @mouseover.self="hoverBoxShow = false">
            <div class="left">
                <ul class="item-list">
                    <li class="top" v-if="topCateList[topCateAct]" @click="getAllGoodsData">{{topCateList[topCateAct].name}}</li>
                    <li class="item" @click="getAllGoodsData" :class="filters.categoryIdx==-1?'active':''">全部</li>
                    <li class="item" :class="filters.categoryIdx==index?'active':''" v-for="(item, index) in secondCategoryList" :key="index" @click="getGoodsToTwoLevel(item.id, index)">{{item.name}}</li>
                </ul>
                <ul class="item-list">
                    <li class="top">品牌</li>
                    <li class="item" @click="getAllBrandGoods" :class="filters.brandIdx==-1?'active':''">全部</li>
                    <li class="item" :class="filters.brandIdx==index?'active':''" v-for="(item, index) in brandList" :key="item.id" @click="getGoodsToBrand(item.id, index)">{{item.name}}</li>
                </ul>
            </div>
            <ul class="shop-item-list">
                <li class="item" v-for="(item ,index) in goodsList" :key="index" @click="onShopItemTap(item.id)">
                    <div class="item-box">
                        <div class="img-box-box">
                            <div class="img-box">
                                 <img alt="寒舍" class="cover" :src="imgUrl+item.picture" />
                            </div>
                        </div>
                        <div class="message-box">
                            <span class="title">{{item.title}}</span>
                            <span class="desc">{{item.brand}}</span>
                            <span class="price">￥{{item.goodsPrice}}</span>
                        </div>
                    </div>
                </li>
                <li class="noData" v-if="goodsList.length == 0">
                     <img alt="寒舍" src="@/assets/img/nodata.png">
                    <span>暂时没有数据</span>
                </li>
            </ul>
        </div>
        <div class="shop-pagination">
            <div class="left"></div>
            <div class="pagination" v-if="goodsList.length">
                <el-pagination background layout="prev, pager, next" :page-size="6" :total="goodsList.length" @current-change="pageChange"></el-pagination>
            </div>
        </div>
        <!-- 商品栏end -->
    </div>
</div>
</template>

<script>
var _ = require('lodash')
import {
    mapState,
    mapActions
} from 'vuex';
export default {
    data() {
        return {
            topGroupId: null,
            hoverBoxShow: false,
            filters: {
                categoryIdx: -1,
                brandIdx: -1,
                topLevelId: null,
                twoLevelId: null,
                goodName: null
            },
            topCateAct: 0,
            topCateList: [],
            secondCategoryList: [],
            brandList: [],
            goodsList: [],
            currentPage: 1,
            findGoodParams: {
                // level, id, page, limit, title, brandId, title
            },
            hoverCategoryList: null,
            hotGoods: null,
            carousels: []
        };
    },
    computed: {
        ...mapState('shopcart', [
            'shopcart'
        ]),
        shopcartNum() {
            var num = 0
            this.shopcart.forEach(item => {
                num = num + item.num
            });
            return num
        }
    },
    methods: {
        ...mapActions('shopcart', [
            'commitShopcartData'
        ]),
        async showHoverLiBox(id) {
            this.topGroupId = id
            this.hoverBoxShow = true
            this.$get(`api/getSecCategory?parentId=${id}`).then(res => {
                if (res.data.errcode === 0) {
                    var arr = res.data.data
                    arr = arr.length > 6 ? _.chunk(arr, 6) : arr
                    this.hoverCategoryList = arr
                    console.log(this.hoverCategoryList)
                }
            })
            var findGoodParams = {
                level: 1,
                id,
                brandId: '',
                title: '',
                page: 1,
                limit: 4
            }
            this.$post('api/findGoods', this.$qs.stringify(findGoodParams)).then(res => {
                if (res.data.errcode === 0) {
                    this.hotGoods = res.data.data
                }
            })
        },
        // 切换分类
        toggleCategory(parentId, secId, idx) {
            this.filters.topLevelId = parentId
            this.filters.twoLevelId = secId
            this.filters.categoryIdx = idx
            this.filters.brandIdx = -1
            this.topCateList.forEach((item, idx) => {
                if (item.id === parentId) {
                    this.topCateAct = idx
                }
            })
            this.secondCategoryList = this.hoverCategoryList
            this.currentPage = 1
            this.findGoodParams = {
                level: 2,
                id: secId,
                brandId: '',
                title: '',
                page: this.currentPage,
                limit: 6
            }
            this.getGoodsData()
        },

        /**
         * 商品详情
         */
        onShopItemTap(id) {
            console.log('onShopItemTap:' + id);
            this.$router.push({
                path: '/shopDetail',
                query: {
                    id
                }
            });
        },
        /**
         * 购物车页面
         */
        onCartTap() {
            this.$router.push('/cart');
        },

        /**
         * 根据二级分类获取商品数据
         */
        async getGoodsToTwoLevel(id, index) {
            this.filters.categoryIdx = index
            this.filters.twoLevelId = id
            this.currentPage = 1
            this.findGoodParams = {
                level: 2,
                id,
                page: this.currentPage,
                limit: 6,
                brandId: '',
                title: ''
            }
            this.getGoodsData()
        },
        /**
         * 获取全部一级分类数据
         */
        getAllGoodsData() {
            this.filters.categoryIdx = -1
            this.filters.brandIdx = -1
            this.currentPage = 1
            this.findGoodParams = {
                level: 1,
                id: this.filters.topLevelId,
                page: this.currentPage,
                limit: 6,
                brandId: '',
                title: ''
            }
            this.getGoodsData()
        },
        hoverGetAllGoodsData() {
            this.secondCategoryList = this.hoverCategoryList
            this.filters.categoryIdx = -1
            this.filters.brandIdx = -1
            this.currentPage = 1
            this.findGoodParams = {
                level: 1,
                id: this.topGroupId,
                page: this.currentPage,
                limit: 6,
                brandId: '',
                title: ''
            }
            this.getGoodsData()
        },
        /**
         * 获取全部品牌商品数据
         */
        getAllBrandGoods() {
            if (this.filters.categoryIdx === -1) {
                this.$message("请先选择一个二级分类")
                return
            }
            this.filters.brandIdx = -1
            this.currentPage = 1
            this.findGoodParams = {
                level: 2,
                id: this.filters.twoLevelId,
                page: this.currentPage,
                limit: 6,
                brandId: '',
                title: ''
            }
            this.getGoodsData()
        },
        /**
         * 根据品牌获取商品数据
         */
        getGoodsToBrand(id, index) {
            if (this.filters.categoryIdx === -1) {
                this.$message("请先选择一个二级分类")
                return
            }
            this.filters.brandIdx = index
            this.currentPage = 1
            this.findGoodParams = {
                level: 2,
                id: this.filters.twoLevelId,
                page: this.currentPage,
                limit: 6,
                brandId: id,
                title: ''
            }
            this.getGoodsData()
        },
        /**
         * 根据名称获取商品数据
         */
        getGoodsToName() {
            this.currentPage = 1
            this.filters.categoryIdx = -1
            this.filters.brandIdx = -1
            var filterName = this.filters.goodName
            filterName = filterName == null ? '' : filterName.trim()
            if (filterName == '' || filterName == null) {
                // this.$notify({
                //     title: '温馨提示',
                //     message: '请输入商品名称 !',
                //     type: 'warning'
                // });
                this.$message.info('请输入商品名称 !');
                this.filters.goodName = null
                return false
            }
            this.findGoodParams = {
                level: 2,
                id: this.filters.categoryIdx === -1 ? '' : this.filters.twoLevelId,
                page: this.currentPage,
                limit: 6,
                brandId: '',
                title: filterName
            }
            this.getGoodsData()
        },
        /**
         * 分页
         */
        pageChange(page) {
            this.currentPage = page
            this.findGoodParams.page = this.currentPage
            this.getGoodsData()
        },
        //获取商品数据
        getGoodsData() {
            this.$post('api/findGoods', this.$qs.stringify(this.findGoodParams)).then(res => {
                if (res.data.errcode === 0) {
                    this.goodsList = res.data.data
                }
            })
        }
    },
    created() {
        var params = {
            sequence: 10
        }
        this.$post('api/getBanner', this.$qs.stringify(params)).then(res => {
            var data = res.data.data.picture
            this.carousels = data ? data.split(',') : []
        })
        /**
         * 获取商品一级分类
         */
        this.$get('api/getFirCategory').then(res => {
            if (res.data.errcode === 0) {
                this.topCateList = res.data.data
                /**
                 * 进入页面获取第一个一级分类的商品数据
                 */
                this.currentPage = 1
                this.filters.topLevelId = this.topCateList[0].id
                this.findGoodParams = {
                    level: 1,
                    id: this.topCateList[0].id,
                    page: this.currentPage,
                    limit: 6,
                    brandId: '',
                    title: ''
                }
                this.getGoodsData()
                /**
                 * 获取商品二级分类
                 */
                var parentId = this.topCateList[0].id
                this.$get(`api/getSecCategory?parentId=${parentId}`).then(resp => {
                    if (resp.data.errcode === 0) {
                        this.secondCategoryList = resp.data.data
                    }
                })
            }
        })

        /**
         * 获取商品品牌
         */
        this.$get('api/getBrand').then(res => {
            if (res.data.errcode === 0) {
                this.brandList = res.data.data
            }
        })

        this.commitShopcartData()
        localStorage.setItem('nowPayGood', JSON.stringify({}))
    }
};
</script>

<style lang="less" scoped>
@import "../assets/less/common";

@media screen and (max-width: 1000px) {
    .container {
        width: 90% !important;

        /deep/ .pagination {
            button {
                width: 80px !important;
                height: 80px !important;
                line-height: 80px;
            }

            .el-pager {
                .number {
                    width: 80px !important;
                    height: 80px !important;
                    line-height: 80px;
                }
            }
        }
    }

    .top-category-list {
        display: flex;
        justify-content: space-between;

        .top-category-item {
            width: fit-content !important;
            height: fit-content !important;
            margin: 0 !important;

            img {
                width: 100px !important;
                height: 100px !important;
                margin-bottom: 50px;
            }

            span {
                height: fit-content !important;
                line-height: unset;
            }
        }
    }

    .shop-item-list {
        border: 0 !important;

        .message-box {

            .title,
            .desc,
            .price {
                line-height: unset !important;
                height: fit-content !important;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }

    .head-content {
        .input-content {
            input {
                height: 100px !important;
            }

            img {
                height: 50px !important;
            }
        }

        .cart-text {
            width: fit-content !important;
            margin-left: 50px;
        }

        .icon-cart {
            width: 100px !important;
            height: 100px !important;
        }

    }

    .hover-list-box {
        padding: 50px !important;
        height: fit-content !important;

        .title {
            margin-bottom: 50px !important;
        }

        .hover-category-list {
            height: fit-content !important;

            .item {
                line-height: unset !important;
                padding: 20px 0;
            }
        }

        .goods-list {
            width: 100% !important;
            display: flex !important;
        }

        .good-box {
            flex: 1;

            .imgBox {
                width: 100% !important;
                height: 0;
                padding-bottom: 100%;

                img {
                    width: 100% !important;
                    object-fit: cover;
                }
            }

            .name,
            .price {
                line-height: unset !important;
                width: 100% !important;
            }
        }
    }
}
.carousel{
    width: 100%;
    height: 400px;
    /deep/ .carousel{
        width: 100%;
        height: 100%;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
}

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

.top {
    width: 100%;
}

.container {
    font-size: 16px;
    margin: 20px auto 100px;
    width: 70%;
}

// 一级分类栏目
.top-category-list-box {
    position: relative;

    .hover-list-box {
        position: absolute;
        left: 0;
        top: 120px;
        background-color: #fff;
        box-sizing: border-box;
        box-shadow: 0 2px 3px rgba(0, 0, 0, .13);
        overflow: hidden;
        width: 100%;
        z-index: 100;
        display: flex;
        padding: 20px;
        height: 350px;

        .list-box-left {
            border-right: 1px dashed #ddd;
            margin-right: 40px;

            .title {
                font-size: 18px;
                line-height: 30px;
                color: #999;
                margin-bottom: 10px;
            }

            .hover-category-list {
                color: #000;
                height: 270px;
                display: flex;
                flex-flow: column;
                flex-wrap: wrap;
                min-width: 300px;

                .item {
                    width: 150px;
                    line-height: 45px;
                    font-size: 18px;
                    cursor: pointer;

                    &:last-of-type {
                        margin-bottom: 0;
                    }

                    &:hover {
                        color: #454B6C;
                        font-weight: 600;
                    }
                }

                .item-active {
                    color: #454B6C;
                    font-weight: 600;
                }
            }
        }

        .list-box-right {
            flex: 1;

            .title {
                font-size: 18px;
                color: #999;
                margin-bottom: 10px;
                line-height: 30px;
            }

            .goods-list {
                display: flex;

                .good-box {
                    width: 200px;
                    margin-right: 20px;
                    display: flex;
                    flex-flow: column;
                    align-items: flex-start;

                    .imgBox {
                        width: 100% !important;
                        height: 0;
                        padding-bottom: 100%;
                        overflow: hidden;

                        img {
                            width: 100% !important;
                            object-fit: cover;
                        }
                    }

                    &:last-of-type {
                        margin-right: 0;
                    }

                    img {
                        // height: 200px;
                        width: 100%;
                        object-fit: cover;
                        margin-bottom: .133333rem;
                        cursor: pointer;
                    }

                    .name {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 16px;
                        color: #999;
                        display: block;
                        line-height: 30px;
                        display: block;
                        width: 100%;
                        text-align: left;
                    }

                    .price {
                        color: #000;
                        font-size: 20px;
                        line-height: 30px;
                        text-align: left;
                        display: block;
                        width: 100%;
                        text-align: left;
                    }
                }
            }
        }
    }

    .fade-enter-active {
        transition: all 0.5s ease;
    }

    .fade-leave-active {
        transition: all 0.1s ease;
    }

    .fade-enter,
    .fade-leave-to {
        height: 0
    }
}

.top-category-list {
    display: flex;
    border-bottom: 1px solid rgba(177, 177, 177, 1);
    margin-bottom: 24px;
    padding-top: 17px;

    .top-category-item.active {
        border-bottom: 2px solid #454B6C;
        color: #454B6C;
        font-weight: bold;
    }

    .top-category-item {
        display: flex;
        flex-direction: column;
        width: 150px;
        height: 100px;
        align-items: center;
        padding-bottom: 27px;
        color: rgba(177, 177, 177, 1);
        font-size: 14px;
        cursor: pointer;
        margin-right: 30px;
        justify-content: space-between;
        position: relative;

        &:hover {
            border-bottom: 2px solid #454B6C;
        }

        .li-cover {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 100;
        }

        &:last-of-type {
            margin-right: 0;
        }

        img {
            width: 40px;
            height: 40px;
        }

        span {
            height: 33px;
            line-height: 33px;
        }
    }
}

// 标题栏
.head-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 53px;
}

.search-content {
    display: flex;
    align-items: center;

    .input-content {
        color: rgba(136, 136, 136, 1);
        font-size: 14px;
        text-align: left;
        border: 1px solid rgba(187, 187, 187, 1);
        padding: 0 12px;
        display: flex;
        align-items: center;

        .search-input {
            width: 545px;
            height: 47px;
            border: 0;
            background: none;
        }

        .search-input:focus {
            outline: -webkit-focus-ring-color auto 0px;
            background: none;
        }

        .icon-search {
            height: 25px;
            cursor: pointer;
        }
    }

    .cart-text {
        width: 100px;
        text-align: right;
        margin-right: 10px;
        color: #454B6C;
        cursor: pointer;
    }

    .icon-cart {
        font-size: 18px;
        width: 40px;
        height: 40px;
        cursor: pointer;
    }

    .shopcart-num {
        width: 20px;
        height: 20px;
        position: absolute;
        top: -5px;
        right: -5px;
        background: red;
        color: #fff;
        border-radius: 50%;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

.shop-content {
    display: flex;
    justify-content: space-between;

    .left {
        margin-left: 18px;
        min-width: 203px;

        .item-list {
            li {
                cursor: pointer;
            }

            .top {
                color: #454B6C;
                font-size: 20px;
                text-align: left;
                margin-bottom: 14px;
            }

            .item {
                color: #454B6C;
                font-size: 14px;
                text-align: left;
                margin-left: 18px;
                margin-bottom: 14px;
            }

            .active {
                color: #454B6C;
                font-size: 15px;
                font-weight: bold;
            }
        }
    }

    .shop-item-list {
        flex-wrap: wrap;
        flex: 1;
        margin-left: 60px;
        border: 1px solid rgba(187, 187, 187, 1);
        margin-bottom: 50px;
        min-height: 300px;
        box-sizing: border-box;

        // padding: 13px;
        .noData {
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            color: #8a8a8a;

            img {
                height: 200px;
            }
        }

        .item {
            display: flex;
            width: calc(100%/3);
            cursor: pointer;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            border: 2px solid #fff;
            float: left;

            .item-box {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .img-box-box {
                    width: 100%;
                    padding: 20px;
                }

                .img-box {
                    width: 100%;
                    height: 0;
                    padding-bottom: 100%;
                    box-sizing: border-box;
                    overflow: hidden;

                    .cover {
                        width: 100%;
                    }
                }

                .message-box {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;

                    .title {
                        color: #454B6C;
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 20px;
                        margin-bottom: 10px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .desc {
                        height: 20px;
                        line-height: 20px;
                        color: #454B6C;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }

                    .price {
                        height: 20px;
                        line-height: 20px;
                        color: #454B6C;
                        font-size: 14px;
                    }
                }
            }
        }

        .item:hover {
            border: 2px solid #454B6C;

            .message-box {
                background: #454B6C;

                .title,
                .desc,
                .price {
                    color: #fff;
                }
            }
        }
    }
}

.shop-pagination {
    display: flex;

    .left {
        margin-left: 0.24rem;
        min-width: 2.706667rem;
    }

    .pagination {
        flex: 1;
        margin-left: 0.8rem;
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
</style>
