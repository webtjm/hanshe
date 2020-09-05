<template>
<div class="benefitWrapper">
    <package-wrapper :data="first[0]" @link="linkTo(first[0].id)" />
    <div class="more">
        <div v-for="item in data" :key="item.id" @click="linkTo(item.id)">
            <img alt="寒舍" :src="imgUrl+item.picture">
            <div class="money">
                <span>RMB</span>
                {{item.price}}
            </div>
            <div class="border"></div>
            <div class="title">{{item.name}}</div>
        </div>
    </div>
</div>
</template>

<script>
import PackageWrapper from './PackageWrapper'
export default {
    props: {
        first: {
            type: Array,
            default: () => {
                return []
            }
        },
        data: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    methods: {
        linkTo(id) {
            console.log(id)
            this.$router.push('packageDetail?id=' + id)
        }
    },
    components: {
        PackageWrapper
    }
}
</script>

<style lang="less">
@import '../../assets/less/common.less';
@import "../../assets/font/myFont.css";

@media screen and (max-width: 1000px) {
    .benefitWrapper {
        .more {
            &>div {
                display: flex;
                flex-flow: column;
                justify-content: flex-end;
                box-sizing: border-box;
                img {}

                .money {
                    margin-top: 0!important;
                    span {}
                }

                .border {}

                .title {
                    margin: 0;
                    margin-bottom: 20px;
                    font-family: hansans!important;
                    font-size: 20px!important;
                    line-height: unset!important;
                }
            }
        }
    }
}

.benefitWrapper {
    margin: 0 auto;
    width: 62.5%;

    .more {
        display: flex;

        // justify-content: space-between;
        &>div {
            width: 33%;
            height: 198px;
            position: relative;
            margin-right: 10px;

            img {
                position: absolute;
                width: 100%;
                height: 198px;
                object-fit: cover;
                border-radius: 8px;
                z-index: -1;
            }

            .money {
                color: #fff;
                font-size: 20px;
                margin-top: 100px;
                margin-left: 25px;

                span {
                    margin-right: 5px;
                }
            }

            .border {
                width: 35px;
                height: 6px;
                background-color: #fff;
                margin: 5px 25px;
            }

            .title {
                font-size: 14px;
                font-weight: 300;
                font-family: hanzhenMin;
                color: #fff;
                line-height: 20px;
                margin-left: 25px;
                margin-top: 10px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
        }
    }
}
</style>
