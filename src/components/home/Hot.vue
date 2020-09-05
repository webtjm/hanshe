<template>
<div class="hotWrapper">
    <div class="hot" v-for="(item,idx) in data" :key="idx" @click="toHotel(item.id)">
        <img alt="寒舍" :class="idx<2?'left':'right'" class="hotImg" :src="imgUrl+item.scenicPicture">
        <div class="hotContent" :style="'background-color:'+colors[idx]" :class="idx<2?'right':'left'">
            <div class="desTitle">Destination</div>
            <div class="border"></div>
            <div class="name">{{item.city}} · {{item.name}}</div>
            <div class="english">{{item.eName}}</div>
            <div class="description">{{(item.sketch).substr(0,70)+'...'}}</div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        data: {
            default: () => {
                return []
            },
            type: Array
        }
    },
    data() {
        return {
            colors: ['#454B6C', '#454B6C', '#099999', '#099999']
        }
    },
    methods: {
        toHotel(id) {
            this.$router.push('/singleStore?id=' + id)
        }
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/font/myFont.css";

@media screen and (max-width: 1000px) {

    .hotWrapper {

        .hot {
            .hotImg {}

            .hotContent {
                font-weight: normal !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;

                .desTitle,
                .english,
                .border,
                .description {
                    display: none !important;
                }

                .name,
                .description {
                    font-size: 12px !important;
                }
            }
        }
    }
}

.hotWrapper {
    display: flex;
    width: 70%;
    flex-wrap: wrap;
    margin: 0 auto;

    .hot {
        display: flex;
        width: 50%;
        height: 0;
        padding-bottom: 25%;
        position: relative;

        .left {
            left: 0;
        }

        .right {
            right: 0
        }

        .hotImg {
            position: absolute;
            width: 50%;
            height: 100%;
            object-fit: cover;
            box-sizing: border-box;
            overflow: hidden;
        }

        .hotContent {
            position: absolute;
            display: inline-block;
            width: 50%;
            height: 100%;
            box-sizing: border-box;
            background-color: aqua;
            color: #fff;
            text-align: right;
            padding: 8% 7% 6% 6%;
            overflow: hidden;

            .desTitle {
                font-size: 22px;
                color: #fff;
                line-height: 30px;
                text-align: right;
                font-family: Times New Roman;
            }

            .border {
                width: 35px;
                height: 6px;
                background: #fff;
                text-align: right;
                display: inline-block;
                margin-bottom: 15px;
            }

            .border::after {
                clear: both;
            }

            .name,
            .english {
                font-size: 22px;
                font-family: hanzhenMin;
                color: #fff;
                text-align: right;
            }

            & .english {
                font-size: 16px;
            }

            .description {
                font-size: 14px;
                font-weight: 500;
                text-align: left;
                color: #fff;
                margin-top: 30px;
                position: relative;
                right: -14px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 4;
                overflow: hidden;
            }
        }
    }
}
</style>
