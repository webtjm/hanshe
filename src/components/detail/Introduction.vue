<template>
<div class="wrapper">
    <a-carousel dotsClass="slick-dots slick-thumb" autoplay arrows>
        <div slot="prevArrow" slot-scope="props" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
            <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
            <a-icon type="right-circle" />
        </div>
        <a slot="customPaging" slot-scope="props">
            <div class="custom-dot"></div>
        </a>
        <div class="carouselItem" v-for="(item,idx) in data.pictureUrl" :key="idx">
            <img alt="寒舍" :src="imgUrl+item">
        </div>
    </a-carousel>
    <div class="main">
        <div class="title">{{data.name}}</div>
        <div class="english">{{data.eName}}</div>
        <div class="contact">
            <div>
                <div>地址：{{common.formatCity(data.province, data.city)+data.address}}</div>
                <div>电话：{{data.phone}}</div>
            </div>
            <div class="look" @click="lookMap">查看地图 >></div>
        </div>
        <div class="intro">
            <div>
                {{data.sketch}}
            </div>
            <a class="more" href="#infor">查看更多>></a>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {

                }
            }
        }
    },
    methods: {
        lookMap() {
            window.open('http://map.baidu.com/?s=s%26wd%3D' + this.data.address)
        }
    }
};
</script>

.

<style lang="less" scoped>
@import "../../assets/less/common.less";

.wrapper {
    display: flex;
    overflow: hidden;
    margin: 0 auto;
    width: 62.5%;

    .ant-carousel {
        width: 608px;
        height: 320px;
        margin-right: 27px;

        /deep/ .custom-slick-arrow {
            width: 30px;
            height: 30px;
            font-size: 30px;
            color: #fff;
            background-color: rgba(31, 45, 61, 0.11);
            opacity: 0.3;

            &:before {
                display: none;
            }

            &:hover {
                opacity: 0.5;
            }
        }

        .slick-dots {
            li div {
                width: 14px;
                height: 14px;
                background-color: #979184;
                border: 3px solid #fff;
                border-radius: 14px;
                margin: 0 8px;
                position: relative;
                top: -24px;
            }

            .slick-active div {
                background-color: #efeeed;
            }
        }

        .carouselItem {
            img {
                width: 608px;
                height: 320px;
                object-fit: cover;
            }
        }
    }

    .main {
        color: @color;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
            font-size: 32px;
            font-family: hanzhen;
            line-height: 50px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .english {
            font-size: 30px;
            font-family: hanzhen;
        }

        .contact {
            // margin-top: 30px;
            display: flex;
            align-items: center;

            div {
                font-size: #8d8d8d;
                font-size: 14px;
            }

            .look {
                color: @color;
                font-weight: bold;
                margin-left: 38px;
            }
        }

        .intro {
            font-size: #8d8d8d;
            font-size: 14px;
            line-height: 26px;
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 10px;

            div {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 4;
                overflow: hidden;
            }

            .more {
                color: @color;
                font-weight: bold;
                margin-left: 38px;
                float: right;
            }
        }
    }
}
</style>
